import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
// import { useAppDispatch } from 'state'
// import { updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { useMasterChef } from './useContract'
import { useGasPrice, useSingleCallResult, useTransactionAdder } from 'store'
import { useActiveWeb3React } from './useActiveWeb3React'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

export const useStake = (pid: number) => {
  const { account } = useActiveWeb3React()
  const masterChefContract: any = useMasterChef()

  const addTransaction = useTransactionAdder()

  const stake = async (amount, referrer) => {
    return masterChefContract.functions
      .deposit(
        pid,
        new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
      )
      .then((res) => {
        addTransaction(res, {})
        return res.hash
      })
  }

  const handleStake = useCallback(
    async (amount: string, referrer: string) => {
      const txHash = await stake(amount, referrer)
      return txHash
    },
    [account, masterChefContract, pid]
  )

  return { onStake: handleStake }
}

// export const useSousStake = (sousId: number, isUsingBnb = false) => {
//   const dispatch = useAppDispatch()
//   const { account } = useWeb3React()
//   const masterChefContract = useMasterChef()
//   const sousChefContract = useSousChef(sousId)

//   const handleStake = useCallback(
//     async (amount: string, decimals: number, referrer: string) => {
//       if (sousId === 0) {
//         await stake(masterChefContract, 0, amount, referrer, account)
//       } else if (isUsingBnb) {
//         await sousStakeBnb(sousChefContract, amount, account)
//       } else {
//         await sousStake(sousChefContract, amount, decimals, account)
//       }
//       dispatch(updateUserStakedBalance(sousId, account))
//       dispatch(updateUserBalance(sousId, account))
//     },
//     [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
//   )

//   return { onStake: handleStake }
// }
