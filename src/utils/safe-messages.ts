import { getBytes, hashMessage, type TypedDataDomain, type JsonRpcSigner } from 'ethers'
import { gte } from 'semver'
import { adjustVInSignature } from '@safe-global/protocol-kit/dist/src/utils/signatures'

import { hashTypedData } from '@/utils/web3'
import { isValidAddress } from './validation'
import { isWalletRejection } from '@/utils/wallets'
import { getSupportedSigningMethods } from '@/services/tx/tx-sender/sdk'
import {
  type SafeInfo,
  type SafeMessage,
  type EIP712TypedData,
  type ChainInfo,
  FEATURES,
} from '@safe-global/safe-gateway-typescript-sdk'

import { hasFeature } from './chains'
import { asError } from '@/services/exceptions/utils'

/*
 * From v1.3.0, EIP-1271 support was moved to the CompatibilityFallbackHandler.
 * Also 1.3.0 introduces the chainId in the domain part of the SafeMessage
 */
const EIP1271_FALLBACK_HANDLER_SUPPORTED_SAFE_VERSION = '1.3.0'

const EIP1271_SUPPORTED_SAFE_VERSION = '1.0.0'

const EIP1271_OFFCHAIN_SUPPORTED_SAFE_APPS_SDK_VERSION = '7.11.0'

/**
 * Typeguard for EIP712TypedData
 *
 */
export const isEIP712TypedData = (obj: any): obj is EIP712TypedData => {
  return typeof obj === 'object' && obj != null && 'domain' in obj && 'types' in obj && 'message' in obj
}

export const generateSafeMessageMessage = (message: SafeMessage['message']): string => {
  return typeof message === 'string' ? hashMessage(message) : hashTypedData(message)
}

/**
 * Generates `SafeMessage` typed data for EIP-712
 * https://github.com/safe-global/safe-contracts/blob/main/contracts/handler/CompatibilityFallbackHandler.sol#L12
 * @param safe Safe which will sign the message
 * @param message Message to sign
 * @returns `SafeMessage` types for signing
 */
export const generateSafeMessageTypedData = (
  { version, chainId, address }: SafeInfo,
  message: SafeMessage['message'],
): EIP712TypedData => {
  if (!version) {
    throw Error('Cannot create SafeMessage without version information')
  }
  const isHandledByFallbackHandler = gte(version, EIP1271_FALLBACK_HANDLER_SUPPORTED_SAFE_VERSION)

  return {
    domain: isHandledByFallbackHandler
      ? {
          chainId: chainId,
          verifyingContract: address.value,
        }
      : { verifyingContract: address.value },
    types: {
      SafeMessage: [{ name: 'message', type: 'bytes' }],
    },
    message: {
      message: generateSafeMessageMessage(message),
    },
  }
}

export const generateSafeMessageHash = (safe: SafeInfo, message: SafeMessage['message']): string => {
  const typedData = generateSafeMessageTypedData(safe, message)
  return hashTypedData(typedData)
}

export const isOffchainEIP1271Supported = (
  { version, fallbackHandler }: SafeInfo,
  chain: ChainInfo | undefined,
  sdkVersion?: string,
): boolean => {
  if (!version) {
    return false
  }

  // check feature toggle
  if (!chain || !hasFeature(chain, FEATURES.EIP1271)) {
    return false
  }

  // If the Safe apps sdk does not support off-chain signing yet
  if (sdkVersion && !gte(sdkVersion, EIP1271_OFFCHAIN_SUPPORTED_SAFE_APPS_SDK_VERSION)) {
    return false
  }

  // Check if Safe has fallback handler
  const isHandledByFallbackHandler = gte(version, EIP1271_FALLBACK_HANDLER_SUPPORTED_SAFE_VERSION)
  if (isHandledByFallbackHandler) {
    // We only check if any fallback Handler is set as we expect / assume that users who overwrite the fallback handler by a custom one know what they are doing
    return fallbackHandler !== null && isValidAddress(fallbackHandler.value)
  }

  // check if Safe version supports EIP-1271
  return gte(version, EIP1271_SUPPORTED_SAFE_VERSION)
}

export const tryOffChainMsgSigning = async (
  signer: JsonRpcSigner,
  safe: SafeInfo,
  message: SafeMessage['message'],
): Promise<string> => {
  const signingMethods = getSupportedSigningMethods(safe.version)

  for await (const [i, signingMethod] of signingMethods.entries()) {
    try {
      if (signingMethod === 'eth_signTypedData') {
        const typedData = generateSafeMessageTypedData(safe, message)
        const signature = await signer.signTypedData(
          typedData.domain as TypedDataDomain,
          typedData.types,
          typedData.message,
        )

        // V needs adjustment when signing with ledger / trezor through metamask
        return adjustVInSignature(signingMethod, signature)
      }

      if (signingMethod === 'eth_sign') {
        const signerAddress = await signer.getAddress()

        const messageHash = generateSafeMessageHash(safe, message)
        const signature = await signer.signMessage(getBytes(messageHash))

        return adjustVInSignature(signingMethod, signature, messageHash, signerAddress)
      }
    } catch (error) {
      const isLastSigningMethod = i === signingMethods.length - 1

      if (isWalletRejection(asError(error)) || isLastSigningMethod) {
        throw error
      }
    }
  }

  // Won't be reached, but TS otherwise complains
  throw new Error('No supported signing methods')
}
