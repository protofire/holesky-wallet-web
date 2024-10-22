import { Box, Stack, Typography } from '@mui/material'
import FieldsGrid from '@/components/tx/FieldsGrid'
import type { StakingTxDepositInfo } from '@safe-global/safe-gateway-typescript-sdk'
import {
  ConfirmationViewTypes,
  type NativeStakingDepositConfirmationView,
} from '@safe-global/safe-gateway-typescript-sdk'
import ConfirmationOrderHeader from '@/components/tx/ConfirmationOrder/ConfirmationOrderHeader'
import { formatDurationFromMilliseconds, formatVisualAmount } from '@/utils/formatters'
import { formatCurrency } from '@/utils/formatNumber'
import StakingStatus from '@/features/stake/components/StakingStatus'
import { InfoTooltip } from '@/features/stake/components/InfoTooltip'

type StakingOrderConfirmationViewProps = {
  order: NativeStakingDepositConfirmationView | StakingTxDepositInfo
}

const CURRENCY = 'USD'

const StakingConfirmationTxDeposit = ({ order }: StakingOrderConfirmationViewProps) => {
  const isOrder = order.type === ConfirmationViewTypes.KILN_NATIVE_STAKING_DEPOSIT

  // the fee is returned in decimal format, so we multiply by 100 to get the percentage
  const fee = (order.fee * 100).toFixed(2)
  return (
    <Stack gap={isOrder ? 2 : 1}>
      {isOrder && (
        <ConfirmationOrderHeader
          blocks={[
            {
              value: order.value || '0',
              tokenInfo: order.tokenInfo,
              label: 'Deposit',
            },
            {
              value: order.annualNrr.toFixed(3) + '%',
              label: 'Rewards rate (after fees)',
            },
          ]}
        />
      )}

      <FieldsGrid title="Net annual rewards">
        {formatVisualAmount(order.expectedAnnualReward, order.tokenInfo.decimals)} {order.tokenInfo.symbol}
        {' ('}
        {formatCurrency(order.expectedFiatAnnualReward, CURRENCY)})
      </FieldsGrid>

      <FieldsGrid title="Net monthly rewards">
        {formatVisualAmount(order.expectedMonthlyReward, order.tokenInfo.decimals)} {order.tokenInfo.symbol}
        {' ('}
        {formatCurrency(order.expectedFiatMonthlyReward, CURRENCY)})
      </FieldsGrid>

      <FieldsGrid
        title={
          <>
            Fee
            <InfoTooltip title="The widget fee incurred here is charged by Kiln for the operation of this widget. The fee is calculated automatically. Part of the fee will contribute to a license fee that supports the Safe Community. Neither the Safe Ecosystem Foundation nor Safe{Wallet} operates the Kiln Widget and/or Kiln." />
          </>
        }
      >
        {fee} %
      </FieldsGrid>

      <Stack
        {...{ [isOrder ? 'border' : 'borderTop']: '1px solid' }}
        {...(isOrder ? { p: 2, borderRadius: 1 } : { mt: 1, pt: 2, pb: 1 })}
        borderColor="border.light"
        gap={1}
      >
        {isOrder ? (
          <Typography fontWeight="bold" mb={2}>
            You will own{' '}
            <Box component="span" bgcolor="border.background" px={1} py={0.5} borderRadius={1}>
              {order.numValidators} Ethereum validator{order.numValidators === 1 ? '' : 's'}
            </Box>
          </Typography>
        ) : (
          <FieldsGrid title="Validators">{order.numValidators}</FieldsGrid>
        )}

        <FieldsGrid title="Activation time">{formatDurationFromMilliseconds(order.estimatedEntryTime)}</FieldsGrid>

        <FieldsGrid title="Rewards">Approx. every 5 days after activation</FieldsGrid>

        {!isOrder && (
          <FieldsGrid title="Validator status">
            <StakingStatus status={order.status} />
          </FieldsGrid>
        )}

        {isOrder && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            Earn ETH rewards with dedicated validators. Rewards must be withdrawn manually, and you can request a
            withdrawal at any time.
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

export default StakingConfirmationTxDeposit
