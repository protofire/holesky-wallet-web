import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Typography } from '@mui/material'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@/utils/chains'

// Cow Swap expects native token addresses to be in the format '0xeeee...eeee'
const adjustEthAddress = (address: string) => {
  if (address && Number(address) === 0) {
    const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    return ETH_ADDRESS
  }
  return address
}

const SwapWidgetNoSSR = dynamic(() => import('@/features/swap'), { ssr: false })

const SwapPage: NextPage = () => {
  const router = useRouter()
  const { token, amount } = router.query
  const isFeatureEnabled = useHasFeature(FEATURES.NATIVE_SWAPS)

  let sell = undefined
  if (token && amount) {
    sell = {
      asset: adjustEthAddress(String(token ?? '')),
      amount: adjustEthAddress(String(amount ?? '')),
    }
  }

  return (
    <>
      <Head>
        <title>{'Safe{Wallet} – Swap'}</title>
      </Head>

      <main style={{ height: 'calc(100vh - 52px)' }}>
        {isFeatureEnabled === true ? (
          <SwapWidgetNoSSR sell={sell} />
        ) : isFeatureEnabled === false ? (
          <Typography textAlign="center" my={3}>
            Swaps are not supported on this network.
          </Typography>
        ) : null}
      </main>
    </>
  )
}

export default SwapPage
