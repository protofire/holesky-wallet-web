import { HexEncodedData } from '@/components/transactions/HexEncodedData'
import { Operation } from '@safe-global/safe-gateway-typescript-sdk'
import type { TransactionData } from '@safe-global/safe-gateway-typescript-sdk'
import { useState, useEffect } from 'react'
import type { Dispatch, ReactElement, SetStateAction } from 'react'
import type { AccordionProps } from '@mui/material/Accordion/Accordion'
import SingleTxDecoded from '@/components/transactions/TxDetails/TxData/DecodedData/SingleTxDecoded'
import { Button, Divider, Stack } from '@mui/material'
import css from './styles.module.css'
import classnames from 'classnames'

type MultisendProps = {
  txData?: TransactionData
  showDelegateCallWarning?: boolean
  compact?: boolean
}

export const MultisendActionsHeader = ({
  setOpen,
  amount,
  compact = false,
  title = 'All actions',
}: {
  setOpen: Dispatch<SetStateAction<Record<number, boolean> | undefined>>
  amount: number
  compact?: boolean
  title?: string
}) => {
  const onClickAll = (expanded: boolean) => () => {
    setOpen(Array(amount).fill(expanded))
  }

  return (
    <div data-testid="all-actions" className={classnames(css.actionsHeader, { [css.compactHeader]: compact })}>
      {title}
      <Stack direction="row" divider={<Divider className={css.divider} />}>
        <Button data-testid="expande-all-btn" onClick={onClickAll(true)} variant="text">
          Expand all
        </Button>
        <Button data-testid="collapse-all-btn" onClick={onClickAll(false)} variant="text">
          Collapse all
        </Button>
      </Stack>
    </div>
  )
}

export const Multisend = ({
  txData,
  showDelegateCallWarning = true,
  compact = false,
}: MultisendProps): ReactElement | null => {
  const [openMap, setOpenMap] = useState<Record<number, boolean>>()
  const isOpenMapUndefined = openMap == null

  // multiSend method receives one parameter `transactions`
  const multiSendTransactions = txData?.dataDecoded?.parameters?.[0].valueDecoded

  useEffect(() => {
    // Initialise whether each transaction should be expanded or not
    if (isOpenMapUndefined && multiSendTransactions) {
      setOpenMap(
        multiSendTransactions.map(({ operation }) => {
          return showDelegateCallWarning ? operation === Operation.DELEGATE : false
        }),
      )
    }
  }, [multiSendTransactions, isOpenMapUndefined, showDelegateCallWarning])

  if (!txData) return null

  // ? when can a multiSend call take no parameters?
  if (!txData.dataDecoded?.parameters) {
    if (txData.hexData) {
      return <HexEncodedData title="Data (hex encoded)" hexData={txData.hexData} />
    }
    return null
  }

  if (!multiSendTransactions) {
    return null
  }

  return (
    <>
      <MultisendActionsHeader setOpen={setOpenMap} amount={multiSendTransactions.length} compact={compact} />

      <div className={compact ? css.compact : ''}>
        {multiSendTransactions.map(({ dataDecoded, data, value, to, operation }, index) => {
          const onChange: AccordionProps['onChange'] = (_, expanded) => {
            setOpenMap((prev) => ({
              ...prev,
              [index]: expanded,
            }))
          }

          return (
            <SingleTxDecoded
              key={`${data ?? to}-${index}`}
              tx={{
                dataDecoded,
                data,
                value,
                to,
                operation,
              }}
              txData={txData}
              showDelegateCallWarning={showDelegateCallWarning}
              actionTitle={`${index + 1}`}
              variant={compact ? 'outlined' : 'elevation'}
              expanded={openMap?.[index] ?? false}
              onChange={onChange}
            />
          )
        })}
      </div>
    </>
  )
}

export default Multisend
