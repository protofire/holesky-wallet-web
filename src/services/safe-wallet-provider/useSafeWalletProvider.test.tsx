import * as gateway from '@safe-global/safe-gateway-typescript-sdk'
import * as router from 'next/router'

import * as web3 from '@/hooks/wallets/web3'
import * as notifications from './notifications'
import { act, renderHook } from '@/tests/test-utils'
import { TxModalContext } from '@/components/tx-flow'
import useSafeWalletProvider, { _useTxFlowApi } from './useSafeWalletProvider'
import { SafeWalletProvider } from '.'
import { StoreHydrator, makeStore } from '@/store'
import * as messages from '@/utils/safe-messages'
import { createStoreHydrator } from '@/store/storeHydrator'

const appInfo = {
  id: 1,
  name: 'test',
  description: 'test',
  iconUrl: 'test',
  url: 'test',
}

jest.mock('./notifications', () => {
  return {
    ...jest.requireActual('./notifications'),
    showNotification: jest.fn(),
  }
})

describe('useSafeWalletProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useSafeWalletProvider', () => {
    it('should return a provider', () => {
      const { result } = renderHook(() => useSafeWalletProvider(), {
        initialReduxState: {
          safeInfo: {
            loading: false,
            error: undefined,
            data: {
              chainId: '1',
              address: {
                value: '0x1234567890000000000000000000000000000000',
              },
            } as gateway.SafeInfo,
          },
        },
      })

      expect(result.current instanceof SafeWalletProvider).toBe(true)
    })
  })

  describe('_useTxFlowApi', () => {
    it('should return a provider', () => {
      const { result } = renderHook(() => _useTxFlowApi('1', '0x1234567890000000000000000000000000000000'))

      expect(result.current?.signMessage).toBeDefined()
      expect(result.current?.signTypedMessage).toBeDefined()
      expect(result.current?.send).toBeDefined()
      expect(result.current?.getBySafeTxHash).toBeDefined()
      expect(result.current?.switchChain).toBeDefined()
      expect(result.current?.proxy).toBeDefined()
    })

    it('should open signing window for off-chain messages', () => {
      jest.spyOn(router, 'useRouter').mockReturnValue({} as unknown as router.NextRouter)
      jest.spyOn(messages, 'isOffchainEIP1271Supported').mockReturnValue(true)
      const showNotificationSpy = jest.spyOn(notifications, 'showNotification')

      const mockSetTxFlow = jest.fn()

      const { result } = renderHook(() => _useTxFlowApi('1', '0x1234567890000000000000000000000000000000'), {
        // TODO: Improve render/renderHook to allow custom wrappers within the "defaults"
        wrapper: ({ children }) => (
          <StoreHydrator>
            <TxModalContext.Provider value={{ setTxFlow: mockSetTxFlow } as any}>{children}</TxModalContext.Provider>
          </StoreHydrator>
        ),
      })

      const resp = result?.current?.signMessage('message', appInfo)

      expect(showNotificationSpy).toHaveBeenCalledWith('Signature request', {
        body: 'test wants you to sign a message. Open the Holesky Safe to continue.',
      })

      expect(mockSetTxFlow.mock.calls[0][0].props).toStrictEqual({
        logoUri: appInfo.iconUrl,
        name: appInfo.name,
        message: 'message',
        requestId: expect.any(String),
        safeAppId: 1,
      })

      expect(resp).toBeInstanceOf(Promise)
    })

    it('should open a signing window for on-chain messages', async () => {
      jest.spyOn(router, 'useRouter').mockReturnValue({} as unknown as router.NextRouter)
      jest.spyOn(messages, 'isOffchainEIP1271Supported').mockReturnValue(true)
      const showNotificationSpy = jest.spyOn(notifications, 'showNotification')

      const mockSetTxFlow = jest.fn()

      const StoreHydrator = createStoreHydrator(() =>
        makeStore({ settings: { signing: { useOnChainSigning: false } } }),
      )

      const { result } = renderHook(() => _useTxFlowApi('1', '0x1234567890000000000000000000000000000000'), {
        // TODO: Improve render/renderHook to allow custom wrappers within the "defaults"
        wrapper: ({ children }) => (
          <StoreHydrator>
            <TxModalContext.Provider value={{ setTxFlow: mockSetTxFlow } as any}>{children}</TxModalContext.Provider>
          </StoreHydrator>
        ),
      })

      act(() => {
        // Set Safe settings to on-chain signing
        const resp1 = result.current?.setSafeSettings({ offChainSigning: false })

        expect(resp1).toStrictEqual({ offChainSigning: false })
      })

      const resp2 = result?.current?.signMessage('message', appInfo)

      expect(showNotificationSpy).toHaveBeenCalledWith('Signature request', {
        body: 'test wants you to sign a message. Open the Holesky Safe to continue.',
      })

      // SignMessageOnChainFlow props
      expect(mockSetTxFlow.mock.calls[0][0].props).toStrictEqual({
        props: {
          requestId: expect.any(String),
          message: 'message',
          method: 'signMessage',
        },
      })

      expect(resp2).toBeInstanceOf(Promise)
    })

    it('should open signing window for off-chain typed messages', () => {
      jest.spyOn(router, 'useRouter').mockReturnValue({} as unknown as router.NextRouter)
      const showNotificationSpy = jest.spyOn(notifications, 'showNotification')

      const mockSetTxFlow = jest.fn()

      const { result } = renderHook(() => _useTxFlowApi('1', '0x1234567890000000000000000000000000000000'), {
        // TODO: Improve render/renderHook to allow custom wrappers within the "defaults"
        wrapper: ({ children }) => (
          <StoreHydrator>
            <TxModalContext.Provider value={{ setTxFlow: mockSetTxFlow } as any}>{children}</TxModalContext.Provider>
          </StoreHydrator>
        ),
      })

      const typedMessage = {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'account', type: 'address' },
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' },
          ],
        },
        primaryType: 'Mail',
        domain: {
          name: 'EIP-1271 Example',
          version: '1.0',
          chainId: 5,
          verifyingContract: '0x0000000000000000000000000000000000000000',
        },
        message: {
          from: {
            name: 'Alice',
            account: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          },
          to: {
            name: 'Bob',
            account: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          },
          contents: 'Hello EIP-1271!',
        },
      }

      const resp = result?.current?.signTypedMessage(typedMessage, appInfo)

      expect(showNotificationSpy).toHaveBeenCalledWith('Signature request', {
        body: 'test wants you to sign a message. Open the Holesky Safe to continue.',
      })

      expect(mockSetTxFlow.mock.calls[0][0].props).toStrictEqual({
        logoUri: appInfo.iconUrl,
        name: appInfo.name,
        message: typedMessage,
        requestId: expect.any(String),
        safeAppId: 1,
      })

      expect(resp).toBeInstanceOf(Promise)
    })

    it('should should send (batched) transactions', () => {
      jest.spyOn(router, 'useRouter').mockReturnValue({} as unknown as router.NextRouter)
      const showNotificationSpy = jest.spyOn(notifications, 'showNotification')

      const mockSetTxFlow = jest.fn()

      const { result } = renderHook(() => _useTxFlowApi('1', '0x1234567890000000000000000000000000000000'), {
        // TODO: Improve render/renderHook to allow custom wrappers within the "defaults"
        wrapper: ({ children }) => (
          <StoreHydrator>
            <TxModalContext.Provider value={{ setTxFlow: mockSetTxFlow } as any}>{children}</TxModalContext.Provider>
          </StoreHydrator>
        ),
      })

      const resp = result.current?.send(
        {
          txs: [
            {
              to: '0x1234567890000000000000000000000000000000',
              value: '0',
              data: '0x',
            },
            // Batch
            {
              to: '0x1234567890000000000000000000000000000000',
              value: '0',
              data: '0x',
            },
          ],
          params: { safeTxGas: 0 },
        },
        appInfo,
      )

      expect(showNotificationSpy).toHaveBeenCalledWith('Transaction request', {
        body: 'test wants to submit a transaction. Open the Holesky Safe to continue.',
      })

      expect(mockSetTxFlow.mock.calls[0][0].props).toStrictEqual({
        data: {
          appId: undefined,
          app: appInfo,
          requestId: expect.any(String),
          txs: [
            {
              to: '0x1234567890000000000000000000000000000000',
              value: '0',
              data: '0x',
            },
            // Batch
            {
              to: '0x1234567890000000000000000000000000000000',
              value: '0',
              data: '0x',
            },
          ],
          params: { safeTxGas: 0 },
        },
        onSubmit: expect.any(Function),
      })

      expect(resp).toBeInstanceOf(Promise)
    })

    it('should get tx by safe tx hash', async () => {
      jest.spyOn(gateway as any, 'getTransactionDetails').mockImplementation(() => ({
        hash: '0x123',
      }))

      const { result } = renderHook(() => _useTxFlowApi('1', '0x1234567890000000000000000000000000000000'))

      const resp = await result.current?.getBySafeTxHash('0x123456789000')

      expect(gateway.getTransactionDetails).toHaveBeenCalledWith('1', '0x123456789000')
      expect(resp).toEqual({ hash: '0x123' })
    })

    it('should switch chain', () => {
      const mockPush = jest.fn()
      jest.spyOn(router, 'useRouter').mockReturnValue({
        push: mockPush,
      } as unknown as router.NextRouter)

      // @ts-expect-error - auto accept prompt
      jest.spyOn(window, 'prompt').mockReturnValue(true)

      const { result } = renderHook(() => _useTxFlowApi('1', '0x1234567890000000000000000000000000000000'), {
        initialReduxState: {
          chains: {
            loading: false,
            error: undefined,
            data: [{ chainId: '1', shortName: 'eth' } as gateway.ChainInfo],
          },
        },
      })

      result.current?.switchChain('0x5', appInfo)

      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/',
        query: {
          chain: 'eth',
        },
      })
    })

    it('should proxy RPC calls', async () => {
      const mockSend = jest.fn(() => Promise.resolve({ result: '0x' }))

      jest.spyOn(web3 as any, 'useWeb3ReadOnly').mockImplementation(() => ({
        send: mockSend,
      }))

      const { result } = renderHook(() => _useTxFlowApi('1', '0x1234567890000000000000000000000000000000'))

      result.current?.proxy('eth_chainId', [])

      expect(mockSend).toHaveBeenCalledWith('eth_chainId', [])
    })
  })

  it('should show a tx by hash', () => {
    const routerPush = jest.fn()

    jest.spyOn(router, 'useRouter').mockReturnValue({
      push: routerPush,
      query: {
        safe: '0x1234567890000000000000000000000000000000',
      },
    } as unknown as router.NextRouter)

    const { result } = renderHook(() => _useTxFlowApi('1', '0x1234567890000000000000000000000000000000'))

    result.current?.showTxStatus('0x123')

    expect(routerPush).toHaveBeenCalledWith({
      pathname: '/transactions/tx',
      query: {
        safe: '0x1234567890000000000000000000000000000000',
        id: '0x123',
      },
    })
  })
})
