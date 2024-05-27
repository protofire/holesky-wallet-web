import TxSummary from '@/components/transactions/TxSummary/index'
import * as pending from '@/hooks/useIsPending'
import { render } from '@/tests/test-utils'
import {
  ConflictType,
  DetailedExecutionInfoType,
  type Transaction,
  TransactionListItemType,
  TransactionStatus,
  type TransactionSummary,
} from '@safe-global/safe-gateway-typescript-sdk'
import {
  TransactionInfoType,
  TransactionTokenType,
  TransferDirection,
} from '@safe-global/safe-gateway-typescript-sdk/dist/types/transactions'

const mockTransaction: Transaction = {
  type: TransactionListItemType.TRANSACTION,
  transaction: {
    timestamp: Date.now(),
    executionInfo: {
      type: DetailedExecutionInfoType.MULTISIG,
      nonce: 7,
      confirmationsRequired: 3,
      confirmationsSubmitted: 1,
      missingSigners: [
        { value: '0x6a5602335a878ADDCa4BF63a050E34946B56B5bC' },
        { value: '0x0000000000000000000000000000000000000789' },
      ],
    },
    txInfo: {
      type: TransactionInfoType.TRANSFER,
      direction: TransferDirection.OUTGOING,
      transferInfo: {
        value: '1000000',
        type: TransactionTokenType.NATIVE_COIN,
      },
    },
    txStatus: TransactionStatus.AWAITING_CONFIRMATIONS,
  } as unknown as TransactionSummary,
  conflictType: ConflictType.HAS_NEXT,
}

const mockTransactionWithoutExecutionInfo = {
  ...mockTransaction,
  transaction: { ...mockTransaction.transaction, executionInfo: undefined },
}

const mockTransactionInHistory = {
  ...mockTransaction,
  transaction: { ...mockTransaction.transaction, txStatus: TransactionStatus.SUCCESS },
}

describe('TxSummary', () => {
  it('should display a nonce if transaction is not grouped', () => {
    const { getByText } = render(<TxSummary item={mockTransaction} isGrouped={false} />)

    expect(getByText('7')).toBeInTheDocument()
  })

  it('should not display a nonce if transaction is grouped', () => {
    const { queryByText } = render(<TxSummary item={mockTransaction} isGrouped={true} />)

    expect(queryByText('7')).not.toBeInTheDocument()
  })

  it('should not display a nonce if there is no executionInfo', () => {
    const { queryByText } = render(<TxSummary item={mockTransactionWithoutExecutionInfo} isGrouped={true} />)

    expect(queryByText('7')).not.toBeInTheDocument()
  })

  it('should display confirmations if transactions is in queue', () => {
    const { getByText } = render(<TxSummary item={mockTransaction} isGrouped={false} />)

    expect(getByText('1 out of 3')).toBeInTheDocument()
  })

  it('should not display confirmations if transactions is already executed', () => {
    const { queryByText } = render(<TxSummary item={mockTransactionInHistory} isGrouped={false} />)

    expect(queryByText('1 out of 3')).not.toBeInTheDocument()
  })

  it('should not display confirmations if there is no executionInfo', () => {
    const { queryByText } = render(<TxSummary item={mockTransactionWithoutExecutionInfo} isGrouped={false} />)

    expect(queryByText('1 out of 3')).not.toBeInTheDocument()
  })

  it('should display a Sign button if confirmations are missing', () => {
    const { getByText } = render(<TxSummary item={mockTransaction} isGrouped={false} />)

    expect(getByText('Confirm')).toBeInTheDocument()
  })

  it('should display a status label if transaction is in queue and pending', () => {
    jest.spyOn(pending, 'default').mockReturnValue(true)
    const { getByTestId } = render(<TxSummary item={mockTransaction} isGrouped={false} />)

    expect(getByTestId('tx-status-label')).toBeInTheDocument()
  })

  it('should display a status label if transaction is not in queue', () => {
    jest.spyOn(pending, 'default').mockReturnValue(true)
    const { getByTestId } = render(<TxSummary item={mockTransactionInHistory} isGrouped={false} />)

    expect(getByTestId('tx-status-label')).toBeInTheDocument()
  })

  it('should not display a status label if transaction is in queue and not pending', () => {
    jest.spyOn(pending, 'default').mockReturnValue(false)
    const { queryByTestId } = render(<TxSummary item={mockTransaction} isGrouped={false} />)

    expect(queryByTestId('tx-status-label')).not.toBeInTheDocument()
  })
})
