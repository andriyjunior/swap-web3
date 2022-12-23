import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useMasterChef } from './useContract'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useTransactionAdder } from 'store'

export const useUnstake = (pid: number) => {
  const { account } = useActiveWeb3React()
  const masterChefContract: any = useMasterChef()
  const addTransaction = useTransactionAdder()

  const unstake = async (amount) => {
    return masterChefContract
      .withdraw(
        pid,
        new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
      )
      .then((res) => {
        addTransaction(res, {})
        return res.hash
      })
  }

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(amount)
      return txHash
    },
    [account, masterChefContract, pid]
  )

  return { onUnstake: handleUnstake }
}

// export const useSousUnstake = (sousId, enableEmergencyWithdraw = false) => {
//   const dispatch = useAppDispatch()
//   const { account } = useWeb3React()
//   const masterChefContract = useMasterChef()
//   const sousChefContract = useSousChef(sousId)

//   const handleUnstake = useCallback(
//     async (amount: string, decimals: number) => {
//       if (sousId === 0) {
//         const txHash = await unstake(masterChefContract, 0, amount, account)
//         console.info(txHash)
//       } else if (enableEmergencyWithdraw) {
//         const txHash = await sousEmergencyUnstake(sousChefContract, account)
//         console.info(txHash)
//       } else {
//         const txHash = await sousUnstake(sousChefContract, amount, decimals, account)
//         console.info(txHash)
//       }
//       dispatch(updateUserStakedBalance(sousId, account))
//       dispatch(updateUserBalance(sousId, account))
//       dispatch(updateUserPendingReward(sousId, account))
//     },
//     [account, dispatch, enableEmergencyWithdraw, masterChefContract, sousChefContract, sousId],
//   )

//   return { onUnstake: handleUnstake }
// }

// export default useUnstake
