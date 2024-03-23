import ChainIndicator from '@/components/common/ChainIndicator'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useTheme } from '@mui/material/styles'
import { type ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import Link from 'next/link'
import type { SelectChangeEvent } from '@mui/material'
import { ListSubheader, MenuItem, Select, Skeleton } from '@mui/material'
import partition from 'lodash/partition'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useChains from '@/hooks/useChains'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { useChainId } from '@/hooks/useChainId'
import { type ReactElement, useMemo } from 'react'
import { useCallback } from 'react'
import { AppRoutes } from '@/config/routes'
import { trackEvent, OVERVIEW_EVENTS } from '@/services/analytics'
import useWallet from '@/hooks/wallets/useWallet'
import { isSocialWalletEnabled } from '@/hooks/wallets/wallets'
import { isSocialLoginWallet } from '@/services/mpc/SocialLoginModule'

const NetworkSelector = (props: { onChainSelect?: () => void }): ReactElement => {
  const wallet = useWallet()
  const isDarkMode = useDarkMode()
  const theme = useTheme()
  const { configs } = useChains()
  const chainId = useChainId()
  const router = useRouter()

  const [testNets, prodNets] = useMemo(() => partition(configs, (config) => config.isTestnet), [configs])

  const getNetworkLink = useCallback(
    (shortName: string) => {
      const shouldKeepPath = !router.query.safe

      const route = {
        pathname: shouldKeepPath ? router.pathname : AppRoutes.index,
        query: {
          chain: shortName,
        } as {
          chain: string
          safeViewRedirectURL?: string
        },
      }

      if (router.query?.safeViewRedirectURL) {
        route.query.safeViewRedirectURL = router.query?.safeViewRedirectURL.toString()
      }

      return route
    },
    [router],
  )

  const onChange = (event: SelectChangeEvent) => {
    event.preventDefault() // Prevent the link click

    const newChainId = event.target.value
    const shortName = configs.find((item) => item.chainId === newChainId)?.shortName

    if (shortName) {
      trackEvent({ ...OVERVIEW_EVENTS.SWITCH_NETWORK, label: newChainId })
      router.push(getNetworkLink(shortName))
    }
  }

  const isSocialLogin = isSocialLoginWallet(wallet?.label)

  const renderMenuItem = useCallback(
    (value: string, chain: ChainInfo) => {
      return (
        <MenuItem
          key={value}
          value={value}
          className={css.menuItem}
          disabled={isSocialLogin && !isSocialWalletEnabled(chain)}
        >
          <Link href={getNetworkLink(chain.shortName)} onClick={props.onChainSelect} className={css.item}>
            <ChainIndicator chainId={chain.chainId} inline />
          </Link>
        </MenuItem>
      )
    },
    [getNetworkLink, isSocialLogin, props.onChainSelect],
  )

  return configs.length ? (
    <Select
      value={chainId}
      onChange={onChange}
      size="small"
      className={css.select}
      variant="standard"
      IconComponent={ExpandMoreIcon}
      MenuProps={{
        transitionDuration: 0,
        sx: {
          '& .MuiPaper-root': {
            overflow: 'auto',
          },
          ...(isDarkMode
            ? {
                '& .Mui-selected, & .Mui-selected:hover': {
                  backgroundColor: `${theme.palette.secondary.background} !important`,
                },
              }
            : {}),
        },
      }}
      sx={{
        '& .MuiSelect-select': {
          py: 0,
        },
      }}
    >
      {prodNets.map((chain) => renderMenuItem(chain.chainId, chain))}

      <ListSubheader className={css.listSubHeader}>Testnets</ListSubheader>

      {testNets.map((chain) => renderMenuItem(chain.chainId, chain))}
    </Select>
  ) : (
    <Skeleton width={94} height={31} sx={{ mx: 2 }} />
  )
}

export default NetworkSelector
