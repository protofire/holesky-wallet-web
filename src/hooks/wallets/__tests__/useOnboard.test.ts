import { ONBOARD_MPC_MODULE_LABEL } from '@/services/mpc/SocialLoginModule'
import { faker } from '@faker-js/faker'
import type { EIP1193Provider, OnboardAPI, WalletState } from '@web3-onboard/core'
import { getConnectedWallet, switchWallet } from '../useOnboard'

// mock wallets
jest.mock('@/hooks/wallets/wallets', () => ({
  getDefaultWallets: jest.fn(() => []),
}))

describe('useOnboard', () => {
  describe('getConnectedWallet', () => {
    it('returns the connected wallet', () => {
      const wallets = [
        {
          label: 'Wallet 1',
          icon: 'wallet1.svg',
          provider: null as unknown as EIP1193Provider,
          chains: [{ id: '0x4' }],
          accounts: [
            {
              address: '0x1234567890123456789012345678901234567890',
              ens: {
                name: 'test.eth',
              },
              balance: {
                ETH: '0.002346456767547',
              },
            },
          ],
        },
        {
          label: 'Wallet 2',
          icon: 'wallet2.svg',
          provider: null as unknown as EIP1193Provider,
          chains: [{ id: '0x100' }],
          accounts: [
            {
              address: '0x2',
              ens: null,
              balance: null,
            },
          ],
        },
      ] as WalletState[]

      expect(getConnectedWallet(wallets)).toEqual({
        label: 'Wallet 1',
        icon: 'wallet1.svg',
        address: '0x1234567890123456789012345678901234567890',
        provider: wallets[0].provider,
        chainId: '4',
        ens: 'test.eth',
        balance: '0.00235 ETH',
      })
    })

    it('should return null if the address is invalid', () => {
      const wallets = [
        {
          label: 'Wallet 1',
          icon: 'wallet1.svg',
          provider: null as unknown as EIP1193Provider,
          chains: [{ id: '0x4' }],
          accounts: [
            {
              address: '0xinvalid',
              ens: null,
              balance: null,
            },
          ],
        },
      ] as WalletState[]

      expect(getConnectedWallet(wallets)).toBeNull()
    })
  })

  describe('switchWallet', () => {
    it('should keep the social signer wallet connected if switching wallets fails', async () => {
      const mockOnboard = {
        state: {
          get: jest.fn().mockReturnValue({
            wallets: [
              {
                accounts: [
                  {
                    address: faker.finance.ethereumAddress(),
                    ens: undefined,
                  },
                ],
                chains: [
                  {
                    id: '5',
                  },
                ],
                label: ONBOARD_MPC_MODULE_LABEL,
              },
            ],
          }),
        },
        connectWallet: jest.fn().mockRejectedValue('Error'),
        disconnectWallet: jest.fn(),
      }

      await switchWallet(mockOnboard as unknown as OnboardAPI)

      expect(mockOnboard.connectWallet).toHaveBeenCalled()
      expect(mockOnboard.disconnectWallet).not.toHaveBeenCalled()
    })

    it('should not disconnect the social signer wallet label if the same label connects', async () => {
      const mockNewState = [
        {
          accounts: [
            {
              address: faker.finance.ethereumAddress(),
              ens: undefined,
            },
          ],
          chains: [
            {
              id: '5',
            },
          ],
          label: ONBOARD_MPC_MODULE_LABEL,
        },
      ]

      const mockOnboard = {
        state: {
          get: jest.fn().mockReturnValue({
            wallets: [
              {
                accounts: [
                  {
                    address: faker.finance.ethereumAddress(),
                    ens: undefined,
                  },
                ],
                chains: [
                  {
                    id: '5',
                  },
                ],
                label: ONBOARD_MPC_MODULE_LABEL,
              },
            ],
          }),
        },
        connectWallet: jest.fn().mockResolvedValue(mockNewState),
        disconnectWallet: jest.fn(),
      }

      await switchWallet(mockOnboard as unknown as OnboardAPI)

      expect(mockOnboard.connectWallet).toHaveBeenCalled()
      expect(mockOnboard.disconnectWallet).not.toHaveBeenCalled()
    })

    it('should not disconnect non social signer wallets if new wallet connects', async () => {
      const mockNewState = [
        {
          accounts: [
            {
              address: faker.finance.ethereumAddress(),
              ens: undefined,
            },
          ],
          chains: [
            {
              id: '5',
            },
          ],
          label: 'MetaMask',
        },
      ]

      const mockOnboard = {
        state: {
          get: jest.fn().mockReturnValue({
            wallets: [
              {
                accounts: [
                  {
                    address: faker.finance.ethereumAddress(),
                    ens: undefined,
                  },
                ],
                chains: [
                  {
                    id: '5',
                  },
                ],
                label: 'Wallet Connect',
              },
            ],
          }),
        },
        connectWallet: jest.fn().mockResolvedValue(mockNewState),
        disconnectWallet: jest.fn(),
      }

      await switchWallet(mockOnboard as unknown as OnboardAPI)

      expect(mockOnboard.connectWallet).toBeCalled()
      expect(mockOnboard.disconnectWallet).not.toHaveBeenCalled()
    })

    it('should disconnect the social signer wallet label if new wallet connects', async () => {
      const mockNewState = [
        {
          accounts: [
            {
              address: faker.finance.ethereumAddress(),
              ens: undefined,
            },
          ],
          chains: [
            {
              id: '5',
            },
          ],
          label: 'MetaMask',
        },
      ]

      const mockOnboard = {
        state: {
          get: jest.fn().mockReturnValue({
            wallets: [
              {
                accounts: [
                  {
                    address: faker.finance.ethereumAddress(),
                    ens: undefined,
                  },
                ],
                chains: [
                  {
                    id: '5',
                  },
                ],
                label: ONBOARD_MPC_MODULE_LABEL,
              },
            ],
          }),
        },
        connectWallet: jest.fn().mockResolvedValue(mockNewState),
        disconnectWallet: jest.fn(),
      }

      await switchWallet(mockOnboard as unknown as OnboardAPI)

      expect(mockOnboard.connectWallet).toBeCalled()
      expect(mockOnboard.disconnectWallet).toHaveBeenCalledWith({ label: ONBOARD_MPC_MODULE_LABEL })
    })
  })
})
