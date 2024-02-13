/**
 * Track analytics events using Google Tag Manager
 */
import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import {
  gtmInit,
  gtmTrackPageview,
  gtmSetChainId,
  gtmEnableCookies,
  gtmDisableCookies,
  gtmSetDeviceType,
  gtmSetSafeAddress,
  gtmSetUserProperty,
  gtmTrack,
} from '@/services/analytics/gtm'
import { spindlInit, spindlAttribute } from './spindl'
import { useAppSelector } from '@/store'
import { CookieType, selectCookies } from '@/store/cookiesSlice'
import useChainId from '@/hooks/useChainId'
import { useRouter } from 'next/router'
import { AppRoutes } from '@/config/routes'
import useMetaEvents from './useMetaEvents'
import { useMediaQuery } from '@mui/material'
import { AnalyticsUserProperties, DeviceType } from './types'
import useSafeAddress from '@/hooks/useSafeAddress'
import useWallet from '@/hooks/wallets/useWallet'
import { OVERVIEW_EVENTS } from './events'

const useGtm = () => {
  const chainId = useChainId()
  const cookies = useAppSelector(selectCookies)
  const isAnalyticsEnabled = cookies[CookieType.ANALYTICS] || false
  const [, setPrevAnalytics] = useState(isAnalyticsEnabled)
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const deviceType = isMobile ? DeviceType.MOBILE : isTablet ? DeviceType.TABLET : DeviceType.DESKTOP
  const safeAddress = useSafeAddress()
  const wallet = useWallet()

  // Initialize GTM and Spindl
  useEffect(() => {
    gtmInit()
    spindlInit()
  }, [])

  // Enable GA cookies if consent was given
  useEffect(() => {
    setPrevAnalytics((prev) => {
      if (isAnalyticsEnabled === prev) return prev

      if (isAnalyticsEnabled) {
        gtmEnableCookies()
      } else {
        gtmDisableCookies()
      }

      return isAnalyticsEnabled
    })
  }, [isAnalyticsEnabled])

  // Set the chain ID for all GTM events
  useEffect(() => {
    gtmSetChainId(chainId)
  }, [chainId])

  // Set device type for all GTM events
  useEffect(() => {
    gtmSetDeviceType(deviceType)
  }, [deviceType])

  // Set safe address for all GTM events
  useEffect(() => {
    gtmSetSafeAddress(safeAddress)

    if (safeAddress) {
      gtmTrack(OVERVIEW_EVENTS.SAFE_VIEWED)
    }
  }, [safeAddress])

  // Track page views – anonymized by default.
  useEffect(() => {
    // Don't track 404 because it's not a real page, it immediately does a client-side redirect
    if (router.pathname === AppRoutes['404']) return

    gtmTrackPageview(router.pathname, router.asPath)
  }, [router.asPath, router.pathname])

  useEffect(() => {
    if (wallet?.label) {
      gtmSetUserProperty(AnalyticsUserProperties.WALLET_LABEL, wallet.label)
    }
  }, [wallet?.label])

  useEffect(() => {
    if (wallet?.address) {
      gtmSetUserProperty(AnalyticsUserProperties.WALLET_ADDRESS, wallet.address)
      spindlAttribute(wallet.address)
    }
  }, [wallet?.address])

  // Track meta events on app load
  useMetaEvents()
}

export default useGtm
