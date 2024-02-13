import { useEffect, useMemo } from 'react'
import type Safe from '@safe-global/protocol-kit'
import { encodeSignatures } from '@/services/tx/encodeSignatures'
import type { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import { OperationType } from '@safe-global/safe-core-sdk-types'
import useAsync from '@/hooks/useAsync'
import useChainId from '@/hooks/useChainId'
import { useWeb3ReadOnly } from '@/hooks/wallets/web3'
import chains from '@/config/chains'
import useSafeAddress from './useSafeAddress'
import useWallet from './wallets/useWallet'
import { useSafeSDK } from './coreSDK/safeCoreSDK'
import useIsSafeOwner from './useIsSafeOwner'
import { Errors, logError } from '@/services/exceptions'

const getEncodedSafeTx = (safeSDK: Safe, safeTx: SafeTransaction, from?: string): string | undefined => {
  const EXEC_TX_METHOD = 'execTransaction'

  return safeSDK
    .getContractManager()
    .safeContract?.encode(EXEC_TX_METHOD, [
      safeTx.data.to,
      safeTx.data.value,
      safeTx.data.data,
      safeTx.data.operation,
      safeTx.data.safeTxGas,
      safeTx.data.baseGas,
      safeTx.data.gasPrice,
      safeTx.data.gasToken,
      safeTx.data.refundReceiver,
      encodeSignatures(safeTx, from),
    ])
}

const incrementByPercentage = (value: bigint, percentage: bigint) => {
  return (value * (BigInt(100) + percentage)) / BigInt(100)
}

const useGasLimit = (
  safeTx?: SafeTransaction,
): {
  gasLimit?: bigint
  gasLimitError?: Error
  gasLimitLoading: boolean
} => {
  const safeSDK = useSafeSDK()
  const web3ReadOnly = useWeb3ReadOnly()
  const safeAddress = useSafeAddress()
  const wallet = useWallet()
  const walletAddress = wallet?.address
  const isOwner = useIsSafeOwner()
  const currentChainId = useChainId()
  const hasSafeTxGas = !!safeTx?.data?.safeTxGas

  const encodedSafeTx = useMemo<string | undefined>(() => {
    if (!safeTx || !safeSDK || !walletAddress) {
      return ''
    }
    return getEncodedSafeTx(safeSDK, safeTx, isOwner ? walletAddress : undefined)
  }, [safeSDK, safeTx, walletAddress, isOwner])

  const operationType = useMemo<number>(
    () => (safeTx?.data.operation == OperationType.DelegateCall ? 1 : 0),
    [safeTx?.data.operation],
  )

  const [gasLimit, gasLimitError, gasLimitLoading] = useAsync<bigint>(() => {
    if (!safeAddress || !walletAddress || !encodedSafeTx || !web3ReadOnly) return

    return web3ReadOnly
      .estimateGas({
        to: safeAddress,
        from: walletAddress,
        data: encodedSafeTx,
        type: operationType,
      })
      .then((gasLimit) => {
        // Due to a bug in Nethermind estimation, we need to increment the gasLimit by 30%
        // when the safeTxGas is defined and not 0. Currently Nethermind is used only for Gnosis Chain.
        if (currentChainId === chains.gno && hasSafeTxGas) {
          const incrementPercentage = BigInt(30) // value defined in %, ex. 30%
          return incrementByPercentage(gasLimit, incrementPercentage)
        }

        return gasLimit
      })
  }, [currentChainId, safeAddress, hasSafeTxGas, walletAddress, encodedSafeTx, web3ReadOnly, operationType])

  useEffect(() => {
    if (gasLimitError) {
      logError(Errors._612, gasLimitError.message)
    }
  }, [gasLimitError])

  return { gasLimit, gasLimitError, gasLimitLoading }
}

export default useGasLimit
