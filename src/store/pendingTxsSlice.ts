import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/store'
import { sameAddress } from '@/utils/addresses'

export enum PendingStatus {
  SIGNING = 'SIGNING',
  SUBMITTING = 'SUBMITTING',
  PROCESSING = 'PROCESSING',
  RELAYING = 'RELAYING',
  INDEXING = 'INDEXING',
}

export enum PendingTxType {
  CUSTOM_TX = 'CUSTOM',
  SAFE_TX = 'SAFE_TX',
}

const ActivePendingStates = [PendingStatus.RELAYING, PendingStatus.INDEXING, PendingStatus.PROCESSING]

export type PendingTxCommonProps = {
  chainId: string
  safeAddress: string
  groupKey?: string
}

type PendingSigningTx = PendingTxCommonProps & {
  status: PendingStatus.SIGNING
  signerAddress: string
}

type PendingSubmittingTx = PendingTxCommonProps & {
  status: PendingStatus.SUBMITTING
}

export type PendingProcessingTx = PendingTxCommonProps &
  (
    | {
        txHash: string
        submittedAt: number
        signerNonce: number
        signerAddress: string
        gasLimit?: string | number | undefined
        status: PendingStatus.PROCESSING
        txType: PendingTxType.SAFE_TX
      }
    | {
        txHash: string
        submittedAt: number
        signerNonce: number
        signerAddress: string
        gasLimit?: string | number | undefined
        data: string
        to: string
        status: PendingStatus.PROCESSING
        txType: PendingTxType.CUSTOM_TX
      }
  )

type PendingRelayingTx = PendingTxCommonProps & {
  taskId: string
  status: PendingStatus.RELAYING
}

type PendingIndexingTx = PendingTxCommonProps & {
  status: PendingStatus.INDEXING
  txHash?: string
}

export type PendingTx =
  | PendingSigningTx
  | PendingSubmittingTx
  | PendingProcessingTx
  | PendingRelayingTx
  | PendingIndexingTx

export type PendingTxsState = {
  [txId: string]: PendingTx
}

const initialState: PendingTxsState = {}

export const pendingTxsSlice = createSlice({
  name: 'pendingTxs',
  initialState,
  reducers: {
    setPendingTx: (state, action: PayloadAction<PendingTx & { txId: string }>) => {
      const { txId, ...pendingTx } = action.payload
      state[txId] = pendingTx
    },
    clearPendingTx: (state, action: PayloadAction<{ txId: string }>) => {
      delete state[action.payload.txId]
    },
  },
})

export const { setPendingTx, clearPendingTx } = pendingTxsSlice.actions

export const selectPendingTxs = (state: RootState): PendingTxsState => {
  return state[pendingTxsSlice.name]
}

export const selectPendingTxById = createSelector(
  [selectPendingTxs, (_: RootState, txId: string) => txId],
  (pendingTxs, txId) => pendingTxs[txId],
)

export const selectPendingTxIdsBySafe = createSelector(
  [selectPendingTxs, (_: RootState, chainId: string, safeAddress: string) => [chainId, safeAddress]],
  (pendingTxs, [chainId, safeAddress]) =>
    Object.keys(pendingTxs).filter(
      (id) => pendingTxs[id].chainId === chainId && sameAddress(pendingTxs[id].safeAddress, safeAddress),
    ),
)
