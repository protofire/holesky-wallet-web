import type { ReactElement } from 'react'
import React from 'react'
import { AppRoutes } from '@/config/routes'
import HomeIcon from '@/public/images/sidebar/home.svg'
import AssetsIcon from '@/public/images/sidebar/assets.svg'
import TransactionIcon from '@/public/images/sidebar/transactions.svg'
import ABIcon from '@/public/images/sidebar/address-book.svg'
import AppsIcon from '@/public/images/apps/apps-icon.svg'
import SettingsIcon from '@/public/images/sidebar/settings.svg'
import { SvgIcon } from '@mui/material'

export type NavItem = {
  label: string
  icon?: ReactElement
  href: string
}

export const navItems: NavItem[] = [
  {
    label: 'Home',
    icon: <SvgIcon component={HomeIcon} inheritViewBox />,
    href: AppRoutes.home,
  },
  {
    label: 'Assets',
    icon: <SvgIcon component={AssetsIcon} inheritViewBox />,
    href: AppRoutes.balances.index,
  },
  {
    label: 'Transactions',
    icon: <SvgIcon component={TransactionIcon} inheritViewBox />,
    href: AppRoutes.transactions.history,
  },
  {
    label: 'Address book',
    icon: <SvgIcon component={ABIcon} inheritViewBox />,
    href: AppRoutes.addressBook,
  },
  {
    label: 'Apps',
    icon: <SvgIcon component={AppsIcon} inheritViewBox />,
    href: AppRoutes.apps.index,
  },
  {
    label: 'Settings',
    icon: <SvgIcon data-testid="settings-nav-icon" component={SettingsIcon} inheritViewBox />,
    href: AppRoutes.settings.setup,
  },
]

export const transactionNavItems = [
  {
    label: 'Queue',
    href: AppRoutes.transactions.queue,
  },
  {
    label: 'History',
    href: AppRoutes.transactions.history,
  },
  {
    label: 'Messages',
    href: AppRoutes.transactions.messages,
  },
]

export const balancesNavItems = [
  {
    label: 'Tokens',
    href: AppRoutes.balances.index,
  },
  {
    label: 'NFTs',
    href: AppRoutes.balances.nfts,
  },
]

export const settingsNavItems = [
  {
    label: 'Setup',
    href: AppRoutes.settings.setup,
  },
  {
    label: 'Appearance',
    href: AppRoutes.settings.appearance,
  },
  {
    label: 'Security & Login',
    href: AppRoutes.settings.securityLogin,
  },
  {
    label: 'Notifications',
    href: AppRoutes.settings.notifications,
  },
  {
    label: 'Modules',
    href: AppRoutes.settings.modules,
  },
  {
    label: 'Safe Apps',
    href: AppRoutes.settings.safeApps.index,
  },
  {
    label: 'Data',
    href: AppRoutes.settings.data,
  },
  {
    label: 'Environment variables',
    href: AppRoutes.settings.environmentVariables,
  },
]

export const generalSettingsNavItems = [
  {
    label: 'Cookies',
    href: AppRoutes.settings.cookies,
  },
  {
    label: 'Appearance',
    href: AppRoutes.settings.appearance,
  },
  {
    label: 'Notifications',
    href: AppRoutes.settings.notifications,
  },
  {
    label: 'Security & Login',
    href: AppRoutes.settings.securityLogin,
  },
  {
    label: 'Data',
    href: AppRoutes.settings.data,
  },
  {
    label: 'Environment variables',
    href: AppRoutes.settings.environmentVariables,
  },
]

export const safeAppsNavItems = [
  {
    label: 'All apps',
    href: AppRoutes.apps.index,
  },
  {
    label: 'My custom apps',
    href: AppRoutes.apps.custom,
  },
]
