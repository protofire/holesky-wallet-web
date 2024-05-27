import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  Divider,
  DialogContent,
  DialogActions,
  Button,
  Box,
  SvgIcon,
  CircularProgress,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import madProps from '@/utils/mad-props'
import useOnboard from '@/hooks/wallets/useOnboard'
import useChainId from '@/hooks/useChainId'
import useSafeAddress from '@/hooks/useSafeAddress'
import { deleteTx } from '@/utils/gateway'
import { getAssertedChainSigner } from '@/services/tx/tx-sender/sdk'
import InfoIcon from '@/public/images/notifications/info.svg'
import ErrorMessage from '@/components/tx/ErrorMessage'
import ExternalLink from '@/components/common/ExternalLink'
import ChainIndicator from '@/components/common/ChainIndicator'
import { txDispatch, TxEvent } from '@/services/tx/txEvents'
import { REJECT_TX_EVENTS } from '@/services/analytics/events/reject-tx'
import { trackEvent } from '@/services/analytics'
import { isWalletRejection } from '@/utils/wallets'

type DeleteTxModalProps = {
  safeTxHash: string
  onClose: () => void
  onSuccess: () => void
  onboard: ReturnType<typeof useOnboard>
  chainId: ReturnType<typeof useChainId>
  safeAddress: ReturnType<typeof useSafeAddress>
}

const _DeleteTxModal = ({ safeTxHash, onSuccess, onClose, onboard, safeAddress, chainId }: DeleteTxModalProps) => {
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onConfirm = async () => {
    setError(undefined)
    setIsLoading(true)
    trackEvent(REJECT_TX_EVENTS.DELETE_CONFIRM)

    if (!onboard || !safeAddress || !chainId || !safeTxHash) {
      setIsLoading(false)
      setError(new Error('Please connect your wallet first'))
      trackEvent(REJECT_TX_EVENTS.DELETE_FAIL)
      return
    }

    try {
      const signer = await getAssertedChainSigner(onboard, chainId)

      await deleteTx({
        safeTxHash,
        safeAddress,
        chainId,
        signer,
      })
    } catch (error) {
      setIsLoading(false)
      setError(error as Error)
      trackEvent(isWalletRejection(error as Error) ? REJECT_TX_EVENTS.DELETE_CANCEL : REJECT_TX_EVENTS.DELETE_FAIL)
      return
    }

    setIsLoading(false)
    txDispatch(TxEvent.DELETED, { safeTxHash })
    onSuccess()
    trackEvent(REJECT_TX_EVENTS.DELETE_SUCCESS)
  }

  const onCancel = () => {
    trackEvent(REJECT_TX_EVENTS.DELETE_CANCEL)
    onClose()
  }

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        <Box data-testid="untrusted-token-warning" display="flex" alignItems="center">
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SvgIcon component={InfoIcon} inheritViewBox color="error" />
            Delete this transaction?
          </Typography>

          <Box flexGrow={1} />

          <ChainIndicator chainId={chainId} />

          <IconButton aria-label="close" onClick={onClose} sx={{ marginLeft: 'auto' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box>
          Are you sure you want to delete this transaction? This will permanently remove it from the queue but the
          already given signatures will remain valid.
        </Box>

        <Box mt={2}>
          Make sure that you are aware of the{' '}
          <ExternalLink href="https://help.safe.global/en/articles/40836-why-do-i-need-to-pay-for-cancelling-a-transaction">
            potential risks
          </ExternalLink>{' '}
          related to deleting a transaction off-chain.
        </Box>

        {error && (
          <Box mt={2}>
            <ErrorMessage error={error}>Error deleting transaction</ErrorMessage>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ padding: 3, justifyContent: 'space-between' }}>
        <Button size="small" variant="text" onClick={onCancel}>
          Keep it
        </Button>

        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={onConfirm}
          disabled={isLoading}
          sx={{ minWidth: '122px', minHeight: '36px' }}
        >
          {isLoading ? <CircularProgress size={20} /> : 'Yes, delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const DeleteTxModal = madProps(_DeleteTxModal, {
  onboard: useOnboard,
  chainId: useChainId,
  safeAddress: useSafeAddress,
})

export default DeleteTxModal
