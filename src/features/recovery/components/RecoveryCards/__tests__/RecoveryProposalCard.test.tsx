import { faker } from '@faker-js/faker'
import type { SafeInfo } from '@safe-global/safe-gateway-typescript-sdk'

import { fireEvent, render } from '@/tests/test-utils'
import { _RecoveryProposalCard } from '../RecoveryProposalCard'

describe('RecoveryProposalCard', () => {
  describe('vertical', () => {
    it('should render correctly', () => {
      const mockClose = jest.fn()
      const mockSetTxFlow = jest.fn()

      const { queryByText } = render(
        <_RecoveryProposalCard
          orientation="vertical"
          onClose={mockClose}
          safe={{ owners: [{ value: faker.finance.ethereumAddress() }] } as SafeInfo}
          setTxFlow={mockSetTxFlow}
        />,
      )

      expect(queryByText('Recover this Account')).toBeTruthy()
      expect(
        queryByText(
          'The connected wallet was chosen as a trusted Recoverer. You can help the owner regain access by resetting the Account setup.',
        ),
      ).toBeTruthy()
      expect(queryByText('Learn more')).toBeTruthy()

      const recoveryButton = queryByText('Start recovery')
      expect(recoveryButton).toBeTruthy()

      fireEvent.click(recoveryButton!)

      expect(mockClose).toHaveBeenCalled()
      expect(mockSetTxFlow).toHaveBeenCalled()
    })
  })
  describe('horizontal', () => {})
  it('should render correctly', () => {
    const mockSetTxFlow = jest.fn()

    const { queryByText } = render(
      <_RecoveryProposalCard
        orientation="horizontal"
        safe={{ owners: [{ value: faker.finance.ethereumAddress() }] } as SafeInfo}
        setTxFlow={mockSetTxFlow}
      />,
    )

    expect(queryByText('Recover this Account')).toBeTruthy()
    expect(
      queryByText(
        'The connected wallet was chosen as a trusted Recoverer. You can help the owner regain access by resetting the Account setup.',
      ),
    ).toBeTruthy()
    expect(queryByText('Learn more')).toBeTruthy()

    const recoveryButton = queryByText('Start recovery')
    expect(recoveryButton).toBeTruthy()

    fireEvent.click(recoveryButton!)

    expect(mockSetTxFlow).toHaveBeenCalled()
  })
})
