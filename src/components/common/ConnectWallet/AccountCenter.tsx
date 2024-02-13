import type { MouseEvent } from 'react'
import { useState } from 'react'
import { Box, ButtonBase, Paper, Popover } from '@mui/material'
import css from '@/components/common/ConnectWallet/styles.module.css'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { type ConnectedWallet } from '@/hooks/wallets/useOnboard'
import WalletOverview from '../WalletOverview'
import WalletInfo from '@/components/common/WalletInfo'

export const AccountCenter = ({ wallet }: { wallet: ConnectedWallet }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const { balance } = wallet

  const openWalletInfo = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeWalletInfo = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <ButtonBase
        onClick={openWalletInfo}
        aria-describedby={id}
        disableRipple
        sx={{ alignSelf: 'stretch' }}
        data-testid="open-account-center"
      >
        <Box className={css.buttonContainer}>
          <WalletOverview wallet={wallet} balance={balance} showBalance />

          <Box display="flex" alignItems="center" justifyContent="flex-end" marginLeft="auto">
            {open ? <ExpandLessIcon color="border" /> : <ExpandMoreIcon color="border" />}
          </Box>
        </Box>
      </ButtonBase>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={closeWalletInfo}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& > .MuiPaper-root': {
            top: 'var(--header-height) !important',
          },
        }}
        transitionDuration={0}
      >
        <Paper className={css.popoverContainer}>
          <WalletInfo wallet={wallet} handleClose={closeWalletInfo} balance={balance} />
        </Paper>
      </Popover>
    </>
  )
}

export default AccountCenter
