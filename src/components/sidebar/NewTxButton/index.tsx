import { type ReactElement, useContext } from 'react'
import Button from '@mui/material/Button'
import { OVERVIEW_EVENTS, trackEvent } from '@/services/analytics'
import CheckWallet from '@/components/common/CheckWallet'
import { TxModalContext } from '@/components/tx-flow'
import { NewTxFlow } from '@/components/tx-flow/flows'
import WatchlistAddButton from '../WatchlistAddButton'

const NewTxButton = (): ReactElement => {
  const { setTxFlow } = useContext(TxModalContext)

  const onClick = () => {
    setTxFlow(<NewTxFlow />, undefined, false)
    trackEvent({ ...OVERVIEW_EVENTS.NEW_TRANSACTION, label: 'sidebar' })
  }

  return (
    <CheckWallet allowSpendingLimit noTooltip>
      {(isOk) =>
        isOk ? (
          <Button
            data-testid="new-tx-btn"
            onClick={onClick}
            variant="contained"
            size="small"
            disabled={!isOk}
            fullWidth
            disableElevation
            sx={{ py: 1.3 }}
          >
            New transaction
          </Button>
        ) : (
          <WatchlistAddButton />
        )
      }
    </CheckWallet>
  )
}

export default NewTxButton
