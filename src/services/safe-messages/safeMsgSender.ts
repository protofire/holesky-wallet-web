import { proposeSafeMessage, confirmSafeMessage } from '@safe-global/safe-gateway-typescript-sdk'
import type { SafeInfo, SafeMessage } from '@safe-global/safe-gateway-typescript-sdk'
import type { Eip1193Provider } from 'ethers'

import { safeMsgDispatch, SafeMsgEvent } from './safeMsgEvents'
import { generateSafeMessageHash, isEIP712TypedData, tryOffChainMsgSigning } from '@/utils/safe-messages'
import { normalizeTypedData } from '@/utils/web3'
import { getAssertedChainSigner } from '@/services/tx/tx-sender/sdk'
import { asError } from '../exceptions/utils'

export const dispatchSafeMsgProposal = async ({
  provider,
  safe,
  message,
  safeAppId,
}: {
  provider: Eip1193Provider
  safe: SafeInfo
  message: SafeMessage['message']
  safeAppId?: number
}): Promise<void> => {
  const messageHash = generateSafeMessageHash(safe, message)

  try {
    const signer = await getAssertedChainSigner(provider)
    const signature = await tryOffChainMsgSigning(signer, safe, message)

    let normalizedMessage = message
    if (isEIP712TypedData(message)) {
      normalizedMessage = normalizeTypedData(message)
    }

    await proposeSafeMessage(safe.chainId, safe.address.value, {
      message: normalizedMessage,
      signature,
      safeAppId,
    })
  } catch (error) {
    safeMsgDispatch(SafeMsgEvent.PROPOSE_FAILED, {
      messageHash,
      error: asError(error),
    })

    throw error
  }

  safeMsgDispatch(SafeMsgEvent.PROPOSE, {
    messageHash,
  })
}

export const dispatchSafeMsgConfirmation = async ({
  provider,
  safe,
  message,
}: {
  provider: Eip1193Provider
  safe: SafeInfo
  message: SafeMessage['message']
}): Promise<void> => {
  const messageHash = generateSafeMessageHash(safe, message)

  try {
    const signer = await getAssertedChainSigner(provider)
    const signature = await tryOffChainMsgSigning(signer, safe, message)

    await confirmSafeMessage(safe.chainId, messageHash, {
      signature,
    })
  } catch (error) {
    safeMsgDispatch(SafeMsgEvent.CONFIRM_PROPOSE_FAILED, {
      messageHash,
      error: asError(error),
    })

    throw error
  }

  safeMsgDispatch(SafeMsgEvent.CONFIRM_PROPOSE, {
    messageHash,
  })
}
