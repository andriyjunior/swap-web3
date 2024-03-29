import { TransactionResponse } from '@ethersproject/providers'
import { Order } from '@gelatonetwork/limit-orders-lib'
import { useActiveWeb3React } from 'hooks'
import { ReactNode, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useAppDispatch } from 'store/utils'
import { addTransaction, TransactionType } from './actions'
import { TransactionDetails } from './reducer'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  customData?: {
    summary?: string
    translatableSummary?: { text: string; data: Record<string, ReactNode> }
    approval?: { tokenAddress: string; spender: string }
    claim?: { recipient: string }
    type?: TransactionType
    order?: Order
  }
) => void {
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  return useCallback(
    (
      response: TransactionResponse,
      {
        summary,
        translatableSummary,
        approval,
        claim,
        type,
        order,
      }: {
        summary?: string
        translatableSummary?: { text: string; data: Record<string, ReactNode> }
        claim?: { recipient: string }
        approval?: { tokenAddress: string; spender: string }
        type?: TransactionType
        order?: Order
      } = {}
    ) => {
      if (!account) return
      if (!chainId) return

      const { hash } = response
      if (!hash) {
        throw Error('No transaction hash found.')
      }
      dispatch(
        addTransaction({
          hash,
          from: account,
          chainId,
          approval,
          summary,
          translatableSummary,
          claim,
          type,
          order,
        })
      )
    },
    [dispatch, chainId, account]
  )
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { chainId } = useActiveWeb3React()

  const state = useSelector<RootState, RootState['transactions']>(
    (s) => s.transactions
  )

  return useMemo(() => (chainId ? state[chainId] ?? {} : {}), [chainId, state])
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions()

  if (!transactionHash || !transactions[transactionHash]) return false

  return !transactions[transactionHash].receipt
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(
  tokenAddress: string | undefined,
  spender: string | undefined
): boolean {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        }
        const { approval } = tx
        if (!approval) return false
        return (
          approval.spender === spender &&
          approval.tokenAddress === tokenAddress &&
          isTransactionRecent(tx)
        )
      }),
    [allTransactions, spender, tokenAddress]
  )
}

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

// calculate pending transactions
export function usePendingTransactions(): {
  hasPendingTransactions: boolean
  pendingNumber: number
} {
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash)
  const hasPendingTransactions = !!pending.length

  return {
    hasPendingTransactions,
    pendingNumber: pending.length,
  }
}
