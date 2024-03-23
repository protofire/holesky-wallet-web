import { trackEvent } from '@/services/analytics'
import { RECOVERY_EVENTS } from '@/services/analytics/events/recovery'
import { Button } from '@mui/material'
import { useContext } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

import CheckWallet from '@/components/common/CheckWallet'
import { TxModalContext } from '@/components/tx-flow'
import { CancelRecoveryFlow } from '@/components/tx-flow/flows'
import useIsSafeOwner from '@/hooks/useIsSafeOwner'
import { dispatchRecoverySkipExpired } from '@/features/recovery/services/recovery-sender'
import useSafeInfo from '@/hooks/useSafeInfo'
import useOnboard from '@/hooks/wallets/useOnboard'
import { trackError, Errors } from '@/services/exceptions'
import { asError } from '@/services/exceptions/utils'
import { useRecoveryTxState } from '@/features/recovery/hooks/useRecoveryTxState'
import { RecoveryListItemContext } from '../RecoveryListItem/RecoveryListItemContext'
import type { RecoveryQueueItem } from '@/features/recovery/services/recovery-state'

export function CancelRecoveryButton({
  recovery,
  compact = false,
}: {
  recovery: RecoveryQueueItem
  compact?: boolean
}): ReactElement {
  const { setSubmitError } = useContext(RecoveryListItemContext)
  const isOwner = useIsSafeOwner()
  const { isExpired, isPending } = useRecoveryTxState(recovery)
  const { setTxFlow } = useContext(TxModalContext)
  const onboard = useOnboard()
  const { safe } = useSafeInfo()

  const onClick = async (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()

    trackEvent(RECOVERY_EVENTS.CANCEL_RECOVERY)
    if (isOwner) {
      setTxFlow(<CancelRecoveryFlow recovery={recovery} />)
    } else if (onboard) {
      try {
        await dispatchRecoverySkipExpired({
          onboard,
          chainId: safe.chainId,
          delayModifierAddress: recovery.address,
          recoveryTxHash: recovery.args.txHash,
        })
      } catch (_err) {
        const err = asError(_err)

        trackError(Errors._813, err)
        setSubmitError(err)
      }
    }
  }

  return (
    <CheckWallet allowNonOwner>
      {(isOk) => {
        const isDisabled = isPending || (isOwner ? !isOk : !isOk || !isExpired)

        return (
          <Button
            data-testid="cancel-recovery-btn"
            onClick={onClick}
            variant="danger"
            disabled={isDisabled}
            size={compact ? 'small' : 'stretched'}
          >
            Cancel
          </Button>
        )
      }}
    </CheckWallet>
  )
}
