import { TokenTransferType } from '@/components/tx-flow/flows/TokenTransfer'
import { CreateTokenTransfer } from '@/components/tx-flow/flows/TokenTransfer/CreateTokenTransfer'
import * as tokenUtils from '@/components/tx-flow/flows/TokenTransfer/utils'
import { render } from '@/tests/test-utils'
import { ZERO_ADDRESS } from '@safe-global/protocol-kit/dist/src/utils/constants'

describe('CreateTokenTransfer', () => {
  const mockParams = {
    recipient: '',
    tokenAddress: ZERO_ADDRESS,
    amount: '',
    type: TokenTransferType.multiSig,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display a token amount input', () => {
    const { getByText } = render(<CreateTokenTransfer params={mockParams} onSubmit={jest.fn()} />)

    expect(getByText('Amount')).toBeInTheDocument()
  })

  it('should display a recipient input', () => {
    const { getAllByText } = render(<CreateTokenTransfer params={mockParams} onSubmit={jest.fn()} />)

    expect(getAllByText('Recipient address')[0]).toBeInTheDocument()
  })

  it('should display a type selection if a spending limit token is selected', () => {
    jest
      .spyOn(tokenUtils, 'useTokenAmount')
      .mockReturnValue({ totalAmount: BigInt(1000), spendingLimitAmount: BigInt(500) })

    const { getByText } = render(<CreateTokenTransfer params={mockParams} onSubmit={jest.fn()} />)

    expect(getByText('Send as')).toBeInTheDocument()
  })

  it('should not display a type selection if there is a txNonce', () => {
    const { queryByText } = render(<CreateTokenTransfer params={mockParams} onSubmit={jest.fn()} txNonce={1} />)

    expect(queryByText('Send as')).not.toBeInTheDocument()
  })
})
