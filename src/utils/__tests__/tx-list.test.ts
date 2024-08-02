import { faker } from '@faker-js/faker'
import { TransactionInfoType } from '@safe-global/safe-gateway-typescript-sdk'
import type { TransactionListItem } from '@safe-global/safe-gateway-typescript-sdk'

import { groupTxs, groupRecoveryTransactions, _getRecoveryCancellations } from '@/utils/tx-list'

describe('tx-list', () => {
  describe('groupConflictingTxs', () => {
    it('should group conflicting transactions', () => {
      const list = [
        { type: 'CONFLICT_HEADER' },
        {
          type: 'TRANSACTION',
          transaction: {
            id: 1,
          },
          conflictType: 'HasNext',
        },
        {
          type: 'TRANSACTION',
          transaction: {
            id: 2,
          },
          conflictType: 'End',
        },
      ]

      const result = groupTxs(list as TransactionListItem[])
      expect(result).toEqual([
        [
          {
            type: 'TRANSACTION',
            transaction: {
              id: 1,
            },
            conflictType: 'HasNext',
          },
          {
            type: 'TRANSACTION',
            transaction: {
              id: 2,
            },
            conflictType: 'End',
          },
        ],
      ])
    })

    it('should organise group by timestamp', () => {
      const list = [
        { type: 'CONFLICT_HEADER' },
        {
          type: 'TRANSACTION',
          transaction: {
            id: 1,
            timestamp: 1,
          },
          conflictType: 'HasNext',
        },
        {
          type: 'TRANSACTION',
          transaction: {
            id: 2,
            timestamp: 2,
          },
          conflictType: 'End',
        },
      ]

      const result = groupTxs(list as TransactionListItem[])
      expect(result).toEqual([
        [
          {
            type: 'TRANSACTION',
            transaction: {
              id: 2,
              timestamp: 2,
            },
            conflictType: 'End',
          },
          {
            type: 'TRANSACTION',
            transaction: {
              id: 1,
              timestamp: 1,
            },
            conflictType: 'HasNext',
          },
        ],
      ])
    })

    it('should group transactions with the same txHash (bulk txs)', () => {
      const list = [
        {
          type: 'TRANSACTION',
          transaction: {
            id: 1,
            txHash: '0x123',
          },
          conflictType: 'None',
        },
        {
          type: 'TRANSACTION',
          transaction: {
            id: 2,
            txHash: '0x123',
          },
          conflictType: 'None',
        },
        {
          type: 'TRANSACTION',
          transaction: {
            id: 3,
            txHash: '0x456',
          },
          conflictType: 'None',
        },
      ]

      const result = groupTxs(list as unknown as TransactionListItem[])
      expect(result).toEqual([
        [
          {
            type: 'TRANSACTION',
            transaction: {
              id: 1,
              txHash: '0x123',
            },
            conflictType: 'None',
          },
          {
            type: 'TRANSACTION',
            transaction: {
              id: 2,
              txHash: '0x123',
            },
            conflictType: 'None',
          },
        ],
        {
          type: 'TRANSACTION',
          transaction: {
            id: 3,
            txHash: '0x456',
          },
          conflictType: 'None',
        },
      ])
    })

    it('should return non-conflicting, and non bulk transaction lists as is', () => {
      const list = [
        {
          type: 'TRANSACTION',
          transaction: {
            id: 1,
            txHash: '0x123',
          },
          conflictType: 'None',
        },
        {
          type: 'TRANSACTION',
          transaction: {
            id: 2,
            txHash: '0x345',
          },
          conflictType: 'None',
        },
      ]

      const result = groupTxs(list as unknown as TransactionListItem[])
      expect(result).toEqual(list)
    })
  })

  describe('getRecoveryCancellations', () => {
    it('should return cancellation transactions', () => {
      const moduleAddress = faker.finance.ethereumAddress()

      const transactions = [
        {
          transaction: {
            txInfo: {
              type: TransactionInfoType.CUSTOM,
              to: {
                value: moduleAddress,
              },
              methodName: 'enableModule',
            },
          },
        },
        {
          transaction: {
            txInfo: {
              type: TransactionInfoType.TRANSFER,
            },
          },
        },
        {
          transaction: {
            txInfo: {
              type: TransactionInfoType.CUSTOM,
              to: {
                value: moduleAddress,
              },
              methodName: 'setTxNonce',
            },
          },
        },
      ]

      expect(_getRecoveryCancellations(moduleAddress, transactions as any)).toEqual([
        {
          transaction: {
            txInfo: {
              type: TransactionInfoType.CUSTOM,
              to: {
                value: moduleAddress,
              },
              methodName: 'setTxNonce',
            },
          },
        },
      ])
    })
  })

  describe('groupRecoveryTransactions', () => {
    it('should group recovery transactions with their cancellations', () => {
      const moduleAddress = faker.finance.ethereumAddress()
      const moduleAddress2 = faker.finance.ethereumAddress()

      const queue = [
        {
          type: 'TRANSACTION',
          transaction: {
            txInfo: {
              type: TransactionInfoType.CUSTOM,
              to: {
                value: moduleAddress,
              },
              methodName: 'enableModule',
            },
          },
        },
        {
          type: 'TRANSACTION',
          transaction: {
            txInfo: {
              type: TransactionInfoType.TRANSFER,
            },
          },
        },
        {
          type: 'TRANSACTION',
          transaction: {
            txInfo: {
              type: TransactionInfoType.CUSTOM,
              to: {
                value: moduleAddress,
              },
              methodName: 'setTxNonce',
            },
          },
        },
      ]

      const recoveryQueue = [
        {
          address: moduleAddress,
        },
        {
          address: moduleAddress2,
        },
      ]

      expect(groupRecoveryTransactions(queue as any, recoveryQueue as any)).toEqual([
        [
          {
            address: moduleAddress,
          },
          {
            type: 'TRANSACTION',
            transaction: {
              txInfo: {
                type: TransactionInfoType.CUSTOM,
                to: {
                  value: moduleAddress,
                },
                methodName: 'setTxNonce',
              },
            },
          },
        ],
        {
          address: moduleAddress2,
        },
      ])
    })
  })
})
