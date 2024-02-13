import { createContext, useState, useEffect } from 'react'
import type { Dispatch, ReactNode, SetStateAction, ReactElement } from 'react'
import type { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import { createTx } from '@/services/tx/tx-sender'
import { useRecommendedNonce, useSafeTxGas } from '../tx/SignOrExecuteForm/hooks'
import { Errors, logError } from '@/services/exceptions'
import type { EIP712TypedData } from '@safe-global/safe-gateway-typescript-sdk'

export const SafeTxContext = createContext<{
  safeTx?: SafeTransaction
  setSafeTx: Dispatch<SetStateAction<SafeTransaction | undefined>>

  safeMessage?: EIP712TypedData
  setSafeMessage: Dispatch<SetStateAction<EIP712TypedData | undefined>>

  safeTxError?: Error
  setSafeTxError: Dispatch<SetStateAction<Error | undefined>>

  nonce?: number
  setNonce: Dispatch<SetStateAction<number | undefined>>
  nonceNeeded?: boolean
  setNonceNeeded: Dispatch<SetStateAction<boolean>>

  safeTxGas?: string
  setSafeTxGas: Dispatch<SetStateAction<string | undefined>>

  recommendedNonce?: number
}>({
  setSafeTx: () => {},
  setSafeMessage: () => {},
  setSafeTxError: () => {},
  setNonce: () => {},
  setNonceNeeded: () => {},
  setSafeTxGas: () => {},
})

const SafeTxProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [safeTx, setSafeTx] = useState<SafeTransaction>()
  const [safeMessage, setSafeMessage] = useState<EIP712TypedData>()
  const [safeTxError, setSafeTxError] = useState<Error>()
  const [nonce, setNonce] = useState<number>()
  const [nonceNeeded, setNonceNeeded] = useState<boolean>(true)
  const [safeTxGas, setSafeTxGas] = useState<string>()

  // Signed txs cannot be updated
  const isSigned = safeTx && safeTx.signatures.size > 0

  // Recommended nonce and safeTxGas
  const recommendedNonce = useRecommendedNonce()
  const recommendedSafeTxGas = useSafeTxGas(safeTx)

  // Priority to external nonce, then to the recommended one
  const finalNonce = isSigned ? safeTx?.data.nonce : nonce ?? recommendedNonce ?? safeTx?.data.nonce
  const finalSafeTxGas = isSigned ? safeTx?.data.safeTxGas : safeTxGas ?? recommendedSafeTxGas ?? safeTx?.data.safeTxGas

  // Update the tx when the nonce or safeTxGas change
  useEffect(() => {
    if (isSigned || !safeTx?.data) return
    if (safeTx.data.nonce === finalNonce && safeTx.data.safeTxGas === finalSafeTxGas) return

    createTx({ ...safeTx.data, safeTxGas: String(finalSafeTxGas) }, finalNonce)
      .then(setSafeTx)
      .catch(setSafeTxError)
  }, [isSigned, finalNonce, finalSafeTxGas, safeTx?.data])

  // Log errors
  useEffect(() => {
    safeTxError && logError(Errors._103, safeTxError)
  }, [safeTxError])

  return (
    <SafeTxContext.Provider
      value={{
        safeTx,
        safeTxError,
        setSafeTx,
        setSafeTxError,
        safeMessage,
        setSafeMessage,
        nonce: finalNonce,
        setNonce,
        nonceNeeded,
        setNonceNeeded,
        safeTxGas: finalSafeTxGas,
        setSafeTxGas,
        recommendedNonce,
      }}
    >
      {children}
    </SafeTxContext.Provider>
  )
}

export default SafeTxProvider
