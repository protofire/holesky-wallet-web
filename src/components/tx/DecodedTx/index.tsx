import { type SyntheticEvent, type ReactElement, memo } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Skeleton,
  SvgIcon,
  Tooltip,
  Typography,
} from '@mui/material'
import { OperationType, type SafeTransaction } from '@safe-global/safe-core-sdk-types'
import type { DecodedDataResponse } from '@safe-global/safe-gateway-typescript-sdk'
import { getTransactionDetails, type TransactionDetails, Operation } from '@safe-global/safe-gateway-typescript-sdk'
import useChainId from '@/hooks/useChainId'
import useAsync from '@/hooks/useAsync'
import { MethodDetails } from '@/components/transactions/TxDetails/TxData/DecodedData/MethodDetails'
import ErrorMessage from '../ErrorMessage'
import Summary, { PartialSummary } from '@/components/transactions/TxDetails/Summary'
import { trackEvent, MODALS_EVENTS } from '@/services/analytics'
import Multisend from '@/components/transactions/TxDetails/TxData/DecodedData/Multisend'
import InfoIcon from '@/public/images/notifications/info.svg'
import ExternalLink from '@/components/common/ExternalLink'
import { HelpCenterArticle } from '@/config/constants'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import accordionCss from '@/styles/accordion.module.css'

type DecodedTxProps = {
  tx?: SafeTransaction
  txId?: string
  showMultisend?: boolean
  decodedData?: DecodedDataResponse
  decodedDataError?: Error
  decodedDataLoading?: boolean
}

const DecodedTx = ({
  tx,
  txId,
  showMultisend = true,
  decodedData,
  decodedDataError,
  decodedDataLoading = false,
}: DecodedTxProps): ReactElement | null => {
  const chainId = useChainId()

  const isMultisend = !!decodedData?.parameters?.[0]?.valueDecoded

  const [txDetails, txDetailsError, txDetailsLoading] = useAsync<TransactionDetails>(() => {
    if (!txId) return
    return getTransactionDetails(chainId, txId)
  }, [chainId, txId])

  const addressInfoIndex = txDetails?.txData?.addressInfoIndex

  const onChangeExpand = (_: SyntheticEvent, expanded: boolean) => {
    trackEvent({ ...MODALS_EVENTS.TX_DETAILS, label: expanded ? 'Open' : 'Close' })
  }

  if (!decodedData) return null

  return (
    <div>
      {isMultisend && showMultisend && (
        <Box my={2}>
          <Multisend
            txData={{
              dataDecoded: decodedData,
              to: { value: tx?.data.to || '' },
              value: tx?.data.value,
              operation: tx?.data.operation === OperationType.DelegateCall ? Operation.DELEGATE : Operation.CALL,
              trustedDelegateCallTarget: false,
              addressInfoIndex,
            }}
            compact
          />
        </Box>
      )}

      <Accordion elevation={0} onChange={onChangeExpand} sx={!tx ? { pointerEvents: 'none' } : undefined}>
        <AccordionSummary
          data-testid="decoded-tx-summary"
          expandIcon={<ExpandMoreIcon />}
          className={accordionCss.accordion}
        >
          <span style={{ flex: 1 }}>Transaction details</span>

          {decodedData ? decodedData.method : tx?.data.operation === OperationType.DelegateCall ? 'Delegate call' : ''}
        </AccordionSummary>

        <AccordionDetails data-testid="decoded-tx-details">
          {decodedData ? (
            <MethodDetails data={decodedData} addressInfoIndex={addressInfoIndex} />
          ) : decodedDataError ? (
            <ErrorMessage error={decodedDataError}>Failed decoding transaction data</ErrorMessage>
          ) : (
            decodedDataLoading && <Skeleton />
          )}

          <Box mt={2}>
            <Typography variant="overline" fontWeight="bold" color="border.main" display="flex" alignItems="center">
              Advanced details
              <Tooltip
                title={
                  <>
                    We recommend not changing the default values unless necessary.{' '}
                    <ExternalLink href={HelpCenterArticle.ADVANCED_PARAMS} title="Learn more about advanced details">
                      Learn more about advanced details
                    </ExternalLink>
                    .
                  </>
                }
                arrow
                placement="top"
              >
                <span>
                  <SvgIcon
                    component={InfoIcon}
                    inheritViewBox
                    color="border"
                    fontSize="small"
                    sx={{
                      verticalAlign: 'middle',
                      ml: 0.5,
                    }}
                  />
                </span>
              </Tooltip>
            </Typography>

            {txDetails ? <Summary txDetails={txDetails} defaultExpanded /> : tx && <PartialSummary safeTx={tx} />}

            {txDetailsLoading && <Skeleton />}

            {txDetailsError && (
              <ErrorMessage error={txDetailsError}>Failed loading all transaction details</ErrorMessage>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default memo(DecodedTx)
