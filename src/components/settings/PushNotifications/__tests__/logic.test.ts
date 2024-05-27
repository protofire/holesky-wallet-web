import * as firebase from 'firebase/messaging'
import { DeviceType } from '@safe-global/safe-gateway-typescript-sdk/dist/types/notifications'
import { BrowserProvider, type JsonRpcSigner, toBeHex } from 'ethers'

import * as logic from '../logic'
import * as web3 from '@/hooks/wallets/web3'
import packageJson from '../../../../../package.json'
import type { ConnectedWallet } from '@/hooks/wallets/useOnboard'
import { MockEip1193Provider } from '@/tests/mocks/providers'

jest.mock('firebase/messaging')

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => Math.random().toString(),
  },
})

Object.defineProperty(globalThis, 'navigator', {
  value: {
    serviceWorker: {
      getRegistrations: () => [],
    },
  },
})

Object.defineProperty(globalThis, 'location', {
  value: {
    origin: 'https://app.safe.global',
  },
})

const MM_SIGNATURE =
  '0x844ba559793a122c5742e9d922ed1f4650d4efd8ea35191105ddaee6a604000165c14f56278bda8d52c9400cdaeaf5cdc38d3596264cc5ccd8f03e5619d5d9d41b'
const LEDGER_SIGNATURE =
  '0xb1274687aea0d8b8578a3eb6da57979eee0a64225e04445a0858e6f8d0d1b5870cdff961513992d849e47e9b0a8d432019829f1e4958837fd86e034656766a4e00'
const ADJUSTED_LEDGER_SIGNATURE =
  '0xb1274687aea0d8b8578a3eb6da57979eee0a64225e04445a0858e6f8d0d1b5870cdff961513992d849e47e9b0a8d432019829f1e4958837fd86e034656766a4e1b'

describe('Notifications', () => {
  let alertMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    window.alert = alertMock
  })

  describe('requestNotificationPermission', () => {
    let requestPermissionMock = jest.fn()

    beforeEach(() => {
      globalThis.Notification = {
        requestPermission: requestPermissionMock,
        permission: 'default',
      } as unknown as jest.Mocked<typeof Notification>
    })

    it('should return true and not request permission again if already granted', async () => {
      globalThis.Notification = {
        requestPermission: requestPermissionMock,
        permission: 'granted',
      } as unknown as jest.Mocked<typeof Notification>

      const result = await logic.requestNotificationPermission()

      expect(requestPermissionMock).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should return false if permission is denied', async () => {
      requestPermissionMock.mockResolvedValue('denied')

      const result = await logic.requestNotificationPermission()

      expect(requestPermissionMock).toHaveBeenCalledTimes(1)
      expect(result).toBe(false)
    })

    it('should return false if permission request throw', async () => {
      requestPermissionMock.mockImplementation(Promise.reject)

      const result = await logic.requestNotificationPermission()

      expect(requestPermissionMock).toHaveBeenCalledTimes(1)
      expect(result).toBe(false)
    })

    it('should return true if permission are granted', async () => {
      requestPermissionMock.mockResolvedValue('granted')

      const result = await logic.requestNotificationPermission()

      expect(requestPermissionMock).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })
  })

  describe('adjustLegerSignature', () => {
    it('should return the same signature if not that of a Ledger', () => {
      const adjustedSignature = logic._adjustLedgerSignatureV(MM_SIGNATURE)

      expect(adjustedSignature).toBe(MM_SIGNATURE)
    })

    it('should return an adjusted signature if is that of a Ledger and v is 0 or 1', () => {
      const adjustedSignature = logic._adjustLedgerSignatureV(LEDGER_SIGNATURE)

      expect(adjustedSignature).toBe(ADJUSTED_LEDGER_SIGNATURE)
    })

    it('should return the same signature if v is 27 or 28', () => {
      const adjustedSignature = logic._adjustLedgerSignatureV(MM_SIGNATURE)

      expect(adjustedSignature).toBe(MM_SIGNATURE)
    })
  })

  describe('getRegisterDevicePayload', () => {
    it('should return the payload with signature', async () => {
      const token = crypto.randomUUID()
      jest.spyOn(firebase, 'getToken').mockImplementation(() => Promise.resolve(token))

      const mockProvider = new BrowserProvider(MockEip1193Provider)

      jest.spyOn(mockProvider, 'getSigner').mockImplementation((address?: string | number | undefined) =>
        Promise.resolve({
          signMessage: jest.fn().mockResolvedValueOnce(MM_SIGNATURE),
        } as unknown as JsonRpcSigner),
      )
      jest.spyOn(web3, 'createWeb3').mockImplementation(() => mockProvider)

      const uuid = crypto.randomUUID()

      const payload = await logic.getRegisterDevicePayload({
        safesToRegister: {
          ['1']: [toBeHex('0x1', 20), toBeHex('0x2', 20)],
          ['2']: [toBeHex('0x1', 20)],
        },
        uuid,
        wallet: {
          label: 'MetaMask',
        } as ConnectedWallet,
      })

      expect(payload).toStrictEqual({
        uuid,
        cloudMessagingToken: token,
        buildNumber: '0',
        bundle: 'safe',
        deviceType: DeviceType.WEB,
        version: packageJson.version,
        timestamp: expect.any(String),
        safeRegistrations: [
          {
            chainId: '1',
            safes: [toBeHex('0x1', 20), toBeHex('0x2', 20)],
            signatures: [MM_SIGNATURE],
          },
          {
            chainId: '2',
            safes: [toBeHex('0x1', 20)],
            signatures: [MM_SIGNATURE],
          },
        ],
      })
    })

    it('should return the payload with a Ledger adjusted signature', async () => {
      const token = crypto.randomUUID()
      jest.spyOn(firebase, 'getToken').mockImplementation(() => Promise.resolve(token))

      const mockProvider = new BrowserProvider(MockEip1193Provider)

      jest.spyOn(mockProvider, 'getSigner').mockImplementation(() =>
        Promise.resolve({
          signMessage: jest.fn().mockResolvedValueOnce(LEDGER_SIGNATURE),
        } as unknown as JsonRpcSigner),
      )
      jest.spyOn(web3, 'createWeb3').mockImplementation(() => mockProvider)

      const uuid = crypto.randomUUID()

      const payload = await logic.getRegisterDevicePayload({
        safesToRegister: {
          ['1']: [toBeHex('0x1', 20), toBeHex('0x2', 20)],
          ['2']: [toBeHex('0x1', 20)],
        },
        uuid,
        wallet: {
          label: 'Ledger',
        } as ConnectedWallet,
      })

      expect(payload).toStrictEqual({
        uuid,
        cloudMessagingToken: token,
        buildNumber: '0',
        bundle: 'safe',
        deviceType: DeviceType.WEB,
        version: packageJson.version,
        timestamp: expect.any(String),
        safeRegistrations: [
          {
            chainId: '1',
            safes: [toBeHex('0x1', 20), toBeHex('0x2', 20)],
            signatures: [ADJUSTED_LEDGER_SIGNATURE],
          },
          {
            chainId: '2',
            safes: [toBeHex('0x1', 20)],
            signatures: [ADJUSTED_LEDGER_SIGNATURE],
          },
        ],
      })
    })
  })
})
