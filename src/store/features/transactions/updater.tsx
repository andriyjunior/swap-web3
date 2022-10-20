import { useWeb3React } from '@web3-react/core'
import { DescriptionWithTx } from 'components'
import { useBlockNumber } from 'context'
import { useToast } from 'hooks'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch, RootState } from 'store'

import { checkedTransaction, finalizeTransaction } from './actions'

export function shouldCheck(
  currentBlock: number,
  tx: { addedTime: number; receipt?: any; lastCheckedBlockNumber?: number }
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = currentBlock - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  }
  if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  }
  // otherwise every block
  return true
}

export default function Updater(): null {
  const { library, chainId } = useWeb3React()
  const { t } = useTranslation()

  const { toastError, toastSuccess } = useToast()

  const currentBlock = useBlockNumber()

  const dispatch = useAppDispatch()
  const state = useSelector<RootState, RootState['transactions']>(
    (s) => s.transactions
  )

  const transactions = useMemo(
    () => (chainId ? state[chainId] ?? {} : {}),
    [chainId, state]
  )

  useEffect(() => {
    if (!chainId || !library || !currentBlock) return

    Object.keys(transactions)
      .filter((hash) => shouldCheck(currentBlock, transactions[hash]))
      .forEach((hash) => {
        library
          .getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                })
              )

              const toast = receipt.status === 1 ? toastSuccess : toastError

              toast(
                t('Transaction receipt'),
                <DescriptionWithTx>{receipt.transactionHash}</DescriptionWithTx>
              )
            } else {
              dispatch(
                checkedTransaction({ chainId, hash, blockNumber: currentBlock })
              )
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [
    chainId,
    library,
    transactions,
    currentBlock,
    dispatch,
    toastSuccess,
    toastError,
    t,
  ])

  return null
}
