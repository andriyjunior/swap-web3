import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
// import { updateUserBalance, updateUserPendingReward } from 'state/actions'
// import { soushHarvest, soushHarvestBnb, harvest } from 'utils/callHelpers'
import { useMasterChef } from './useContract'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useTransactionAdder } from 'store'
import { AddressZero } from '@ethersproject/constants'

export const harvest = async (
  masterChefContract,
  pid,
  account,
  addTransaction
) => {
  if (pid === 0) {
    return masterChefContract.functions.withdraw(pid, '0').then((res) => {
      addTransaction(res, {})
    })
  }

  return masterChefContract.methods
    .deposit(pid, '0', AddressZero)
    .then((res) => {
      addTransaction(res, {})
    })
}

export const useHarvest = (farmPid: number) => {
  const { account } = useActiveWeb3React()
  const masterChefContract = useMasterChef()

  const addTransaction = useTransactionAdder()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(
      masterChefContract,
      farmPid,
      account,
      addTransaction
    )
    return txHash
  }, [account, farmPid, masterChefContract])

  return { onReward: handleHarvest }
}

// export const useSousHarvest = (sousId, isUsingBnb = false) => {
//   const dispatch = useAppDispatch()
//   const { account } = useWeb3React()
//   const sousChefContract = useSousChef(sousId)
//   const masterChefContract = useMasterChef()

//   const handleHarvest = useCallback(async () => {
//     if (sousId === 0) {
//       await harvest(masterChefContract, 0, account)
//     } else if (isUsingBnb) {
//       await soushHarvestBnb(sousChefContract, account)
//     } else {
//       await soushHarvest(sousChefContract, account)
//     }
//     dispatch(updateUserPendingReward(sousId, account))
//     dispatch(updateUserBalance(sousId, account))
//   }, [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId])

//   return { onReward: handleHarvest }
// }
