import { type ReactElement } from 'react'
import { Tooltip } from '@mui/material'
import { TransferDirection } from '@safe-global/safe-gateway-typescript-sdk'
import css from './styles.module.css'
import { formatVisualAmount } from '@/utils/formatters'
import TokenIcon from '../TokenIcon'
import classNames from 'classnames'

const PRECISION = 20

const TokenAmount = ({
  value,
  decimals,
  logoUri,
  tokenSymbol,
  direction,
  fallbackSrc,
  preciseAmount,
}: {
  value: string
  decimals?: number
  logoUri?: string
  tokenSymbol?: string
  direction?: TransferDirection
  fallbackSrc?: string
  preciseAmount?: boolean
}): ReactElement => {
  const sign = direction === TransferDirection.OUTGOING ? '-' : ''
  const amount =
    decimals !== undefined ? formatVisualAmount(value, decimals, preciseAmount ? PRECISION : undefined) : value
  const fullAmount =
    decimals !== undefined ? sign + formatVisualAmount(value, decimals, PRECISION) + ' ' + tokenSymbol : value

  return (
    <Tooltip title={fullAmount}>
      <span className={classNames(css.container, { [css.verticalAlign]: logoUri })}>
        {logoUri && <TokenIcon logoUri={logoUri} tokenSymbol={tokenSymbol} fallbackSrc={fallbackSrc} />}
        <b>
          {sign}
          {amount} {tokenSymbol}
        </b>
      </span>
    </Tooltip>
  )
}

export default TokenAmount
