import { useCurrentChain } from '@/hooks/useChains'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useEffect, useMemo, useContext } from 'react'
import { useSelector } from 'react-redux'
import { Typography, Grid, Alert } from '@mui/material'

import SpendingLimitLabel from '@/components/common/SpendingLimitLabel'
import { getResetTimeOptions } from '@/components/transactions/TxDetails/TxData/SpendingLimits'
import SendAmountBlock from '@/components/tx-flow/flows/TokenTransfer/SendAmountBlock'
import SignOrExecuteForm from '@/components/tx/SignOrExecuteForm'
import useBalances from '@/hooks/useBalances'
import useChainId from '@/hooks/useChainId'
import { trackEvent, SETTINGS_EVENTS } from '@/services/analytics'
import { createNewSpendingLimitTx } from '@/services/tx/tx-sender'
import { selectSpendingLimits } from '@/store/spendingLimitsSlice'
import { formatVisualAmount } from '@/utils/formatters'
import type { NewSpendingLimitFlowProps } from '.'
import EthHashInfo from '@/components/common/EthHashInfo'
import { SafeTxContext } from '../../SafeTxProvider'

export const ReviewSpendingLimit = ({ params }: { params: NewSpendingLimitFlowProps }) => {
  const spendingLimits = useSelector(selectSpendingLimits)
  const { safe } = useSafeInfo()
  const chainId = useChainId()
  const chain = useCurrentChain()
  const { balances } = useBalances()
  const { setSafeTx, setSafeTxError } = useContext(SafeTxContext)
  const token = balances.items.find((item) => item.tokenInfo.address === params.tokenAddress)
  const { decimals } = token?.tokenInfo || {}

  const existingSpendingLimit = useMemo(() => {
    return spendingLimits.find(
      (spendingLimit) =>
        spendingLimit.beneficiary === params.beneficiary && spendingLimit.token.address === params.tokenAddress,
    )
  }, [spendingLimits, params])

  useEffect(() => {
    createNewSpendingLimitTx(params, spendingLimits, chainId, chain, safe.deployed, decimals, existingSpendingLimit)
      .then(setSafeTx)
      .catch(setSafeTxError)
  }, [
    chain,
    chainId,
    decimals,
    existingSpendingLimit,
    params,
    safe.deployed,
    setSafeTx,
    setSafeTxError,
    spendingLimits,
  ])

  const isOneTime = params.resetTime === '0'
  const resetTime = useMemo(() => {
    return isOneTime
      ? 'One-time spending limit'
      : getResetTimeOptions(chainId).find((time) => time.value === params.resetTime)?.label
  }, [isOneTime, params.resetTime, chainId])

  const onFormSubmit = () => {
    trackEvent({
      ...SETTINGS_EVENTS.SPENDING_LIMIT.RESET_PERIOD,
      label: resetTime,
    })
  }

  const existingAmount = existingSpendingLimit
    ? formatVisualAmount(BigInt(existingSpendingLimit?.amount), decimals)
    : undefined

  const oldResetTime = existingSpendingLimit
    ? getResetTimeOptions(chainId).find((time) => time.value === existingSpendingLimit?.resetTimeMin)?.label
    : undefined

  return (
    <SignOrExecuteForm onSubmit={onFormSubmit}>
      {token && (
        <SendAmountBlock amount={params.amount} tokenInfo={token.tokenInfo} title="Amount">
          {existingAmount && existingAmount !== params.amount && (
            <>
              <Typography
                data-testid="old-token-amount"
                color="error"
                sx={{ textDecoration: 'line-through' }}
                component="span"
              >
                {existingAmount}
              </Typography>
              →
            </>
          )}
        </SendAmountBlock>
      )}

      <Grid container gap={1} alignItems="center">
        <Grid item md>
          <Typography variant="body2" color="text.secondary">
            Beneficiary
          </Typography>
        </Grid>

        <Grid data-testid="beneficiary-address" item md={10}>
          <EthHashInfo
            address={params.beneficiary}
            shortAddress={false}
            hasExplorer
            showCopyButton
            showAvatar={false}
          />
        </Grid>
      </Grid>

      <Grid container gap={1} alignItems="center">
        <Grid item md>
          <Typography variant="body2" color="text.secondary">
            Reset time
          </Typography>
        </Grid>
        <Grid item md={10}>
          {existingSpendingLimit ? (
            <>
              <SpendingLimitLabel
                label={
                  <>
                    {existingSpendingLimit.resetTimeMin !== params.resetTime && (
                      <>
                        <Typography
                          data-testid="old-reset-time"
                          color="error"
                          sx={{ textDecoration: 'line-through' }}
                          display="inline"
                          component="span"
                        >
                          {oldResetTime}
                        </Typography>
                        {' → '}
                      </>
                    )}
                    <Typography display="inline" component="span">
                      {resetTime}
                    </Typography>
                  </>
                }
                isOneTime={existingSpendingLimit.resetTimeMin === '0'}
              />
            </>
          ) : (
            <SpendingLimitLabel
              data-testid="spending-limit-label"
              label={resetTime || 'One-time spending limit'}
              isOneTime={!!resetTime && isOneTime}
            />
          )}
        </Grid>
      </Grid>
      {existingSpendingLimit && (
        <Alert severity="warning" sx={{ border: 'unset' }}>
          <Typography data-testid="limit-replacement-warning" fontWeight={700}>
            You are about to replace an existing spending limit
          </Typography>
        </Alert>
      )}
    </SignOrExecuteForm>
  )
}
