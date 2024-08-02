import type { ReactElement, ComponentType, SyntheticEvent } from 'react'
import { Box, IconButton, SvgIcon, Tooltip, Typography } from '@mui/material'
import LinkIcon from '@/public/images/common/link.svg'
import Link from 'next/link'

export type ExplorerButtonProps = {
  title?: string
  href?: string
  className?: string
  icon?: ComponentType
  onClick?: (e: SyntheticEvent) => void
  isCompact?: boolean
}

const ExplorerButton = ({
  title = '',
  href = '',
  icon = LinkIcon,
  className,
  onClick,
  isCompact = true,
}: ExplorerButtonProps): ReactElement => {
  return isCompact ? (
    <Tooltip title={title} placement="top">
      <IconButton
        data-testid="explorer-btn"
        className={className}
        target="_blank"
        rel="noreferrer"
        href={href}
        size="small"
        sx={{ color: 'inherit' }}
        onClick={onClick}
      >
        <SvgIcon component={icon} inheritViewBox fontSize="small" />
      </IconButton>
    </Tooltip>
  ) : (
    <Link
      data-testid="explorer-btn"
      className={className}
      target="_blank"
      rel="noreferrer"
      href={href}
      onClick={onClick}
    >
      <Box display="flex" alignItems="center">
        <Typography fontWeight={700} fontSize="small" mr="var(--space-1)" noWrap>
          View on explorer
        </Typography>

        <SvgIcon component={icon} inheritViewBox fontSize="small" />
      </Box>
    </Link>
  )
}

export default ExplorerButton
