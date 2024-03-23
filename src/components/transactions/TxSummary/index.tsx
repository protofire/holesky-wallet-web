import { Box } from '@mui/material'
import type { ReactElement } from 'react'
import { type Transaction } from '@safe-global/safe-gateway-typescript-sdk'

import css from './styles.module.css'
import DateTime from '@/components/common/DateTime'
import TxInfo from '@/components/transactions/TxInfo'
import { isMultisigExecutionInfo, isTxQueued } from '@/utils/transaction-guards'
import TxType from '@/components/transactions/TxType'
import classNames from 'classnames'
import { isTrustedTx } from '@/utils/transactions'
import UntrustedTxWarning from '../UntrustedTxWarning'
import QueueActions from './QueueActions'
import useIsPending from '@/hooks/useIsPending'
import TxStatusLabel from '../TxStatusLabel'
import TxConfirmations from '../TxConfirmations'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@/utils/chains'

type TxSummaryProps = {
  isGrouped?: boolean
  item: Transaction
}

const TxSummary = ({ item, isGrouped }: TxSummaryProps): ReactElement => {
  const hasDefaultTokenlist = useHasFeature(FEATURES.DEFAULT_TOKENLIST)

  const tx = item.transaction
  const isQueue = isTxQueued(tx.txStatus)
  const nonce = isMultisigExecutionInfo(tx.executionInfo) ? tx.executionInfo.nonce : undefined
  const isTrusted = !hasDefaultTokenlist || isTrustedTx(tx)
  const isPending = useIsPending(tx.id)
  const executionInfo = isMultisigExecutionInfo(tx.executionInfo) ? tx.executionInfo : undefined

  return (
    <Box
      data-testid="transaction-item"
      className={classNames(css.gridContainer, {
        [css.history]: !isQueue,
        [css.grouped]: isGrouped,
        [css.untrusted]: !isTrusted,
      })}
      id={tx.id}
    >
      {nonce !== undefined && !isGrouped && (
        <Box gridArea="nonce" data-testid="nonce" className={css.nonce}>
          {nonce}
        </Box>
      )}

      {!isTrusted && (
        <Box data-testid="warning" gridArea="nonce">
          <UntrustedTxWarning />
        </Box>
      )}

      <Box gridArea="type" data-testid="tx-type">
        <TxType tx={tx} />
      </Box>

      <Box gridArea="info" data-testid="tx-info">
        <TxInfo info={tx.txInfo} />
      </Box>

      <Box gridArea="date" data-testid="tx-date" className={css.date}>
        <DateTime value={tx.timestamp} />
      </Box>

      {isQueue && executionInfo && (
        <Box gridArea="confirmations">
          <TxConfirmations
            submittedConfirmations={executionInfo.confirmationsSubmitted}
            requiredConfirmations={executionInfo.confirmationsRequired}
          />
        </Box>
      )}

      <Box gridArea="status">{isQueue && !isPending ? <QueueActions tx={tx} /> : <TxStatusLabel tx={tx} />}</Box>
    </Box>
  )
}

export default TxSummary
