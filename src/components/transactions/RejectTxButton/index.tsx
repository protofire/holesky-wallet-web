import type { TransactionSummary } from '@safe-global/safe-gateway-typescript-sdk'
import { Button } from '@mui/material'

import type { ReactElement } from 'react'
import { useContext } from 'react'
import { isMultisigExecutionInfo } from '@/utils/transaction-guards'
import useIsPending from '@/hooks/useIsPending'
import Track from '@/components/common/Track'
import { TX_LIST_EVENTS } from '@/services/analytics/events/txList'
import CheckWallet from '@/components/common/CheckWallet'
import { useSafeSDK } from '@/hooks/coreSDK/safeCoreSDK'
import { TxModalContext } from '@/components/tx-flow'
import { ReplaceTxFlow } from '@/components/tx-flow/flows'

const RejectTxButton = ({
  txSummary,
  safeTxHash,
  proposer,
}: {
  txSummary: TransactionSummary
  safeTxHash?: string
  proposer?: string
}): ReactElement | null => {
  const { setTxFlow } = useContext(TxModalContext)
  const txNonce = isMultisigExecutionInfo(txSummary.executionInfo) ? txSummary.executionInfo.nonce : undefined
  const isPending = useIsPending(txSummary.id)
  const safeSDK = useSafeSDK()
  const isDisabled = isPending || !safeSDK

  const openReplacementModal = () => {
    if (txNonce === undefined) return
    setTxFlow(<ReplaceTxFlow txNonce={txNonce} safeTxHash={safeTxHash} proposer={proposer} />, undefined, false)
  }

  return (
    <CheckWallet>
      {(isOk) => (
        <Track {...TX_LIST_EVENTS.REJECT}>
          <Button onClick={openReplacementModal} variant="danger" disabled={!isOk || isDisabled} size="stretched">
            Reject
          </Button>
        </Track>
      )}
    </CheckWallet>
  )
}

export default RejectTxButton
