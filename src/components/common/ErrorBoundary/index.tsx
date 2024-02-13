import { Typography, Link } from '@mui/material'
import type { FallbackRender } from '@sentry/react'

import { HELP_CENTER_URL, IS_PRODUCTION } from '@/config/constants'
import { AppRoutes } from '@/config/routes'
import WarningIcon from '@/public/images/notifications/warning.svg'

import css from '@/components/common/ErrorBoundary/styles.module.css'
import CircularIcon from '../icons/CircularIcon'
import ExternalLink from '../ExternalLink'

const ErrorBoundary: FallbackRender = ({ error, componentStack }) => {
  return (
    <div className={css.container}>
      <div className={css.wrapper}>
        <Typography variant="h3" color="text.primary">
          Something went wrong,
          <br />
          please try again.
        </Typography>

        <CircularIcon icon={WarningIcon} badgeColor="warning" />

        {IS_PRODUCTION ? (
          <Typography color="text.primary">
            In case the problem persists, please reach out to us via our{' '}
            <ExternalLink href={HELP_CENTER_URL}>Help Center</ExternalLink>
          </Typography>
        ) : (
          <>
            {/* Error may be undefined despite what the type says */}
            <Typography color="error">{error?.toString()}</Typography>
            <Typography color="error">{componentStack}</Typography>
          </>
        )}
        <Link href={AppRoutes.welcome.index} color="primary" mt={2}>
          Go home
        </Link>
      </div>
    </div>
  )
}

export default ErrorBoundary
