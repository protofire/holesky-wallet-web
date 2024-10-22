import CheckWallet from '@/components/common/CheckWallet'
import Track from '@/components/common/Track'
import { AppRoutes } from '@/config/routes'
import useSpendingLimit from '@/hooks/useSpendingLimit'
import { Button } from '@mui/material'
import type { TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { TokenType } from '@safe-global/safe-gateway-typescript-sdk'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import StakeIcon from '@/public/images/common/stake.svg'
import type { STAKE_LABELS } from '@/services/analytics/events/stake'
import { STAKE_EVENTS } from '@/services/analytics/events/stake'
import { useCurrentChain } from '@/hooks/useChains'

const StakeButton = ({
  tokenInfo,
  trackingLabel,
}: {
  tokenInfo: TokenInfo
  trackingLabel: STAKE_LABELS
}): ReactElement => {
  const spendingLimit = useSpendingLimit(tokenInfo)
  const chain = useCurrentChain()
  const router = useRouter()

  return (
    <CheckWallet allowSpendingLimit={!!spendingLimit}>
      {(isOk) => (
        <Track {...STAKE_EVENTS.OPEN_STAKE} label={trackingLabel}>
          <Button
            data-testid="stake-btn"
            aria-label="Stake"
            variant="text"
            color="info"
            size="small"
            startIcon={<StakeIcon />}
            onClick={() => {
              router.push({
                pathname: AppRoutes.stake,
                query: {
                  ...router.query,
                  asset: `${chain?.shortName}_${
                    tokenInfo.type === TokenType.NATIVE_TOKEN ? 'NATIVE_TOKEN' : tokenInfo.address
                  }`,
                },
              })
            }}
            disabled={!isOk}
          >
            Stake
          </Button>
        </Track>
      )}
    </CheckWallet>
  )
}

export default StakeButton
