import { zeroPadValue } from 'ethers'
import type { SafeInfo } from '@safe-global/safe-gateway-typescript-sdk'

import { generateSafeMessageTypedData, isOffchainEIP1271Supported } from '../safe-messages'
import { toBeHex } from 'ethers'
import { FEATURES } from '../chains'

const MOCK_ADDRESS = zeroPadValue('0x0123', 20)

describe('safe-messages', () => {
  describe('createSafeMessage', () => {
    it('should generate the correct types for a EIP-191 message for >= 1.3.0 Safes', () => {
      const safe = {
        version: '1.3.0',
        address: {
          value: MOCK_ADDRESS,
        },
        chainId: 1,
      } as unknown as SafeInfo

      const message = 'Hello world!'

      const safeMessage = generateSafeMessageTypedData(safe, message)

      expect(safeMessage).toEqual({
        domain: {
          chainId: 1,
          verifyingContract: MOCK_ADDRESS,
        },
        types: {
          SafeMessage: [{ name: 'message', type: 'bytes' }],
        },
        message: {
          message: '0xaa05af77f274774b8bdc7b61d98bc40da523dc2821fdea555f4d6aa413199bcc',
        },
      })
    })

    it('should generate the correct types for a EIP-191 message for < 1.3.0 Safes', () => {
      const safe = {
        version: '1.1.1',
        address: {
          value: MOCK_ADDRESS,
        },
        chainId: 1,
      } as unknown as SafeInfo

      const message = 'Hello world!'

      const safeMessage = generateSafeMessageTypedData(safe, message)

      expect(safeMessage).toEqual({
        domain: {
          verifyingContract: MOCK_ADDRESS,
        },
        types: {
          SafeMessage: [{ name: 'message', type: 'bytes' }],
        },
        message: {
          message: '0xaa05af77f274774b8bdc7b61d98bc40da523dc2821fdea555f4d6aa413199bcc',
        },
      })
    })

    it('should generate the correct types for an EIP-712 message for >=1.3.0 Safes', () => {
      const safe = {
        version: '1.3.0',
        address: {
          value: MOCK_ADDRESS,
        },
        chainId: 1,
      } as unknown as SafeInfo

      const message = {
        domain: {
          chainId: 1,
          name: 'Ether Mail',
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          version: '1',
        },
        message: {
          contents: 'Hello, Bob!',
          from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          },
          to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          },
        },
        primaryType: 'Mail',
        types: {
          EIP712Domain: [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'version',
              type: 'string',
            },
            {
              name: 'chainId',
              type: 'uint256',
            },
            {
              name: 'verifyingContract',
              type: 'address',
            },
          ],
          Mail: [
            {
              name: 'from',
              type: 'Person',
            },
            {
              name: 'to',
              type: 'Person',
            },
            {
              name: 'contents',
              type: 'string',
            },
          ],
          Person: [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'wallet',
              type: 'address',
            },
          ],
        },
      }

      const safeMessage = generateSafeMessageTypedData(safe, message)

      expect(safeMessage).toEqual({
        domain: {
          chainId: 1,
          verifyingContract: MOCK_ADDRESS,
        },
        types: {
          SafeMessage: [{ name: 'message', type: 'bytes' }],
        },
        message: {
          message: '0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2',
        },
      })
    })

    it('should generate the correct types for an EIP-712 message for <1.3.0 Safes', () => {
      const safe = {
        version: '1.1.1',
        address: {
          value: MOCK_ADDRESS,
        },
        chainId: 1,
      } as unknown as SafeInfo

      const message = {
        domain: {
          chainId: 1,
          name: 'Ether Mail',
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          version: '1',
        },
        message: {
          contents: 'Hello, Bob!',
          from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          },
          to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          },
        },
        primaryType: 'Mail',
        types: {
          EIP712Domain: [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'version',
              type: 'string',
            },
            {
              name: 'chainId',
              type: 'uint256',
            },
            {
              name: 'verifyingContract',
              type: 'address',
            },
          ],
          Mail: [
            {
              name: 'from',
              type: 'Person',
            },
            {
              name: 'to',
              type: 'Person',
            },
            {
              name: 'contents',
              type: 'string',
            },
          ],
          Person: [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'wallet',
              type: 'address',
            },
          ],
        },
      }

      const safeMessage = generateSafeMessageTypedData(safe, message)

      expect(safeMessage).toEqual({
        domain: {
          verifyingContract: MOCK_ADDRESS,
        },
        types: {
          SafeMessage: [{ name: 'message', type: 'bytes' }],
        },
        message: {
          message: '0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2',
        },
      })
    })
  })

  describe('supportsEIP1271', () => {
    it('false for 1.3.0 Safes without fallback handler', () => {
      expect(
        isOffchainEIP1271Supported(
          {
            chainId: '5',
            version: '1.3.0',
            fallbackHandler: null,
          } as any,
          {
            features: [FEATURES.EIP1271],
          } as any,
          '7.11.0',
        ),
      ).toBeFalsy()
    })

    it('false for 1.3.0 Safes with invalid fallback handler', () => {
      expect(
        isOffchainEIP1271Supported(
          {
            chainId: '5',
            version: '0.0.1',
            fallbackHandler: { value: 'this is not an address' },
          } as any,
          {
            features: [FEATURES.EIP1271],
          } as any,
          '7.11.0',
        ),
      ).toBeFalsy()
    })

    it('true for 1.3.0 Safes with fallback handler', () => {
      expect(
        isOffchainEIP1271Supported(
          {
            chainId: '5',
            version: '1.3.0',
            fallbackHandler: { value: toBeHex('0x2222', 20) },
          } as any,
          {
            features: [FEATURES.EIP1271],
          } as any,
          '7.11.0',
        ),
      ).toBeTruthy()
    })

    it('true for 1.1.0 Safes', () => {
      expect(
        isOffchainEIP1271Supported(
          {
            chainId: '5',
            version: '1.0.0',
          } as any,
          {
            features: [FEATURES.EIP1271],
          } as any,
          '7.11.0',
        ),
      ).toBeTruthy()
    })

    it('false for 0.0.1 Safes', () => {
      expect(
        isOffchainEIP1271Supported(
          {
            chainId: '5',
            version: '0.0.1',
          } as any,
          {
            features: [FEATURES.EIP1271],
          } as any,
          '7.11.0',
        ),
      ).toBeFalsy()
    })

    it('false for unsupported safeAppsSdk version', () => {
      expect(
        isOffchainEIP1271Supported(
          {
            chainId: '5',
            version: '1.3.0',
            fallbackHandler: { value: toBeHex('0x2222', 20) },
          } as any,
          {
            features: [FEATURES.EIP1271],
          } as any,
          '7.10.0',
        ),
      ).toBeFalsy()
    })

    it('true for no safeAppsSdk version', () => {
      expect(
        isOffchainEIP1271Supported(
          {
            chainId: '5',
            version: '1.3.0',
            fallbackHandler: { value: toBeHex('0x2222', 20) },
          } as any,
          {
            features: [FEATURES.EIP1271],
          } as any,
        ),
      ).toBeTruthy()
    })
  })
})
