import { Order } from '@gelatonetwork/limit-orders-lib'
import { createAction } from '@reduxjs/toolkit'
import { ChainId } from 'packages/swap-sdk'
// import { Order } from '@gelatonetwork/limit-orders-lib'
import { ReactNode, ReactText } from 'react'

export type TransactionType =
  | 'approve'
  | 'swap'
  | 'wrap'
  | 'add-liquidity'
  | 'remove-liquidity'
  | 'limit-order-submission'
  | 'limit-order-cancellation'
  | 'limit-order-approval'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export const addTransaction = createAction<{
  chainId: ChainId
  hash: string
  from: string
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  summary?: string
  translatableSummary?: { text: string; data: Record<string, ReactNode> }
  type?: TransactionType
  order?: Order
}>('transactions/addTransaction')
export const clearAllTransactions = createAction<{ chainId: ChainId }>(
  'transactions/clearAllTransactions'
)
export const finalizeTransaction = createAction<{
  chainId: ChainId
  hash: string
  receipt: SerializableTransactionReceipt
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: ChainId
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')
