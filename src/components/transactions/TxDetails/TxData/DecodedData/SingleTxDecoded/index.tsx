import { isEmptyHexData } from '@/utils/hex'
import { type InternalTransaction, type TransactionData } from '@safe-global/safe-gateway-typescript-sdk'
import type { AccordionProps } from '@mui/material/Accordion/Accordion'
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import css from './styles.module.css'
import accordionCss from '@/styles/accordion.module.css'
import CodeIcon from '@mui/icons-material/Code'
import DecodedData from '@/components/transactions/TxDetails/TxData/DecodedData'

type SingleTxDecodedProps = {
  tx: InternalTransaction
  txData: TransactionData
  actionTitle: string
  variant?: AccordionProps['variant']
  expanded?: boolean
  onChange?: AccordionProps['onChange']
}

export const SingleTxDecoded = ({ tx, txData, actionTitle, variant, expanded, onChange }: SingleTxDecodedProps) => {
  const isNativeTransfer = tx.value !== '0' && (!tx.data || isEmptyHexData(tx.data))
  const method = tx.dataDecoded?.method || (isNativeTransfer ? 'native transfer' : 'contract interaction')

  const addressInfo = txData.addressInfoIndex?.[tx.to]
  const name = addressInfo?.name

  const singleTxData = {
    to: { value: tx.to },
    value: tx.value,
    operation: tx.operation,
    dataDecoded: tx.dataDecoded,
    hexData: tx.data ?? undefined,
    addressInfoIndex: txData.addressInfoIndex,
    trustedDelegateCallTarget: false, // Nested delegate calls are always untrusted
  }

  return (
    <Accordion variant={variant} expanded={expanded} onChange={onChange}>
      <AccordionSummary data-testid="action-item" expandIcon={<ExpandMoreIcon />} className={accordionCss.accordion}>
        <div className={css.summary}>
          <CodeIcon color="border" fontSize="small" />
          <Typography>{actionTitle}</Typography>
          <Typography ml="8px">
            {name ? name + ': ' : ''}
            <b>{method}</b>
          </Typography>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={1}>
          <DecodedData txData={singleTxData} toInfo={{ value: tx.to }} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export default SingleTxDecoded
