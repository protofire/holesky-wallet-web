import { CircularProgress, type Palette, Typography } from '@mui/material'
import { TransactionStatus, type TransactionSummary } from '@safe-global/safe-gateway-typescript-sdk'
import useIsPending from '@/hooks/useIsPending'
import useTransactionStatus from '@/hooks/useTransactionStatus'

const getStatusColor = (value: TransactionStatus, palette: Palette) => {
  switch (value) {
    case TransactionStatus.SUCCESS:
      return palette.success.main
    case TransactionStatus.FAILED:
    case TransactionStatus.CANCELLED:
      return palette.error.main
    case TransactionStatus.AWAITING_CONFIRMATIONS:
    case TransactionStatus.AWAITING_EXECUTION:
      return palette.warning.main
    default:
      return palette.primary.main
  }
}

const TxStatusLabel = ({ tx }: { tx: TransactionSummary }) => {
  const txStatusLabel = useTransactionStatus(tx)
  const isPending = useIsPending(tx.id)

  return (
    <Typography
      variant="caption"
      fontWeight="bold"
      display="flex"
      alignItems="center"
      gap={1}
      color={({ palette }) => getStatusColor(tx.txStatus, palette)}
    >
      {isPending && <CircularProgress size={14} color="inherit" />}
      {txStatusLabel}
    </Typography>
  )
}

export default TxStatusLabel
