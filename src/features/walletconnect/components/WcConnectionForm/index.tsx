import { useCallback, useEffect } from 'react'
import { Grid, Typography, Divider, SvgIcon, IconButton, Tooltip, Box } from '@mui/material'
import type { ReactElement } from 'react'
import type { SessionTypes } from '@walletconnect/types'
import useLocalStorage from '@/services/local-storage/useLocalStorage'
import InfoIcon from '@/public/images/notifications/info.svg'
import WcHints from '../WcHints'
import WcSessionList from '../WcSessionList'
import WcInput from '../WcInput'
import WcLogoHeader from '../WcLogoHeader'
import css from './styles.module.css'
import useSafeInfo from '@/hooks/useSafeInfo'
import Track from '@/components/common/Track'
import { WALLETCONNECT_EVENTS } from '@/services/analytics/events/walletconnect'

const WC_HINTS_KEY = 'wcHints'

export const WcConnectionForm = ({
  sessions,
  onDisconnect,
  uri,
}: {
  sessions: SessionTypes.Struct[]
  onDisconnect: (session: SessionTypes.Struct) => Promise<void>
  uri: string
}): ReactElement => {
  const [showHints = true, setShowHints] = useLocalStorage<boolean>(WC_HINTS_KEY)
  const { safeLoaded } = useSafeInfo()

  const onToggle = useCallback(() => {
    setShowHints((prev) => !prev)
  }, [setShowHints])

  // Show the hints only once
  useEffect(() => {
    return () => setShowHints(false)
  }, [setShowHints])

  return (
    <Grid className={css.container}>
      <Grid item textAlign="center">
        <Tooltip
          title={showHints ? 'Hide how WalletConnect works' : 'How does WalletConnect work?'}
          placement="top"
          arrow
          className={css.infoIcon}
        >
          <span>
            <Track {...(showHints ? WALLETCONNECT_EVENTS.HINTS_HIDE : WALLETCONNECT_EVENTS.HINTS_SHOW)}>
              <IconButton onClick={onToggle}>
                <SvgIcon component={InfoIcon} inheritViewBox color="border" />
              </IconButton>
            </Track>
          </span>
        </Tooltip>

        <WcLogoHeader />

        <Typography variant="body2" color="text.secondary">
          {safeLoaded
            ? `Paste the pairing code below to connect to your Safe{Wallet} via WalletConnect`
            : `Please open one of your Safe Accounts to connect to via WalletConnect`}
        </Typography>

        {safeLoaded ? (
          <Box mt={3}>
            <WcInput uri={uri} />
          </Box>
        ) : null}
      </Grid>

      <Divider flexItem />

      <Grid item>
        <WcSessionList sessions={sessions} onDisconnect={onDisconnect} />
      </Grid>

      {showHints && (
        <>
          <Divider flexItem />

          <Grid item mt={1}>
            <WcHints />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default WcConnectionForm
