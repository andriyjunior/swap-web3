import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import farmsConfig from 'config/constants/farms'
import { orderBy } from 'lodash'

import { BIG_ZERO } from 'utils/bigNumber'

import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import {
  fetchFarmsPublicDataAsync,
  // fetchPoolsPublicDataAsync,
  // fetchPoolsUserDataAsync,
  // setBlock,
} from '../farms'
import { State, Farm, Pool, FarmsState } from 'store/types'
import { useAppDispatch } from 'store/utils'
import { fetchFarmUserDataAsync } from './reducer'
import {
  useActiveWeb3React,
  useFastRefreshEffect,
  useSlowRefreshEffect,
} from 'hooks'
// import { transformPool } from './pools/helpers'
// import { fetchPoolsStakingLimitsAsync } from './pools'
// import { fetchFarmUserDataAsync, nonArchivedFarms } from './farms'

export const usePollFarmsData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  // const { slowRefresh } = useRefresh()
  const { account, library, chainId } = useActiveWeb3React()

  useSlowRefreshEffect(() => {
    // const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms
    const farmsToFetch = farmsConfig
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchFarmsPublicDataAsync(pids))

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids, library, chainId }))
    }
  }, [account])
}

/**
 * Fetches the "core" farm data used globally
 * 0 = CAKE-BNB LP
 * 1 = BUSD-BNB LP
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    dispatch(fetchFarmsPublicDataAsync([0, 1]))
  }, [dispatch])
}

// export const usePollBlockNumber = () => {
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const blockNumber = await web3NoAccount.eth.getBlockNumber()
//       dispatch(setBlock(blockNumber))
//     }, 6000)

//     return () => clearInterval(interval)
//   }, [dispatch])
// }

// // Farms

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
  return farms
}

export const useFarmFromPid = (pid): Farm | undefined => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.pid === pid)
  )
  return farm
}

// export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
//   const farm = useSelector((state: State) =>
//     state.farms.data.find((f) => f.lpSymbol === lpSymbol)
//   )
//   return farm
// }

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  if (farm) {
    return {
      allowance: farm.userData
        ? new BigNumber(farm.userData.allowance)
        : BIG_ZERO,
      tokenBalance: farm.userData
        ? new BigNumber(farm.userData.tokenBalance)
        : BIG_ZERO,
      stakedBalance: farm.userData
        ? new BigNumber(farm.userData.stakedBalance)
        : BIG_ZERO,
      earnings: farm.userData
        ? new BigNumber(farm.userData.earnings)
        : BIG_ZERO,
    }
  } else {
    return {
      allowance: BIG_ZERO,
      tokenBalance: BIG_ZERO,
      stakedBalance: BIG_ZERO,
      earnings: BIG_ZERO,
    }
  }
}

// // Return a farm for a given token symbol. The farm is filtered based on attempting to return a farm with a quote token from an array of preferred quote tokens
// export const useFarmFromTokenSymbol = (
//   tokenSymbol: string,
//   preferredQuoteTokens?: string[]
// ): Farm => {
//   const farms = useSelector((state: State) =>
//     state.farms.data.filter((farm) => farm.token.symbol === tokenSymbol)
//   )
//   const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens)
//   return filteredFarm
// }

// // Return the base token price for a farm, from a given pid
// export const useBusdPriceFromPid = (pid: number): BigNumber => {
//   const farm = useFarmFromPid(pid)
//   return farm && new BigNumber(farm.token.busdPrice)
// }

// export const useBusdPriceFromToken = (tokenSymbol: string): BigNumber => {
//   const tokenFarm = useFarmFromTokenSymbol(tokenSymbol)
//   const tokenPrice = useBusdPriceFromPid(tokenFarm?.pid)
//   return tokenPrice
// }

// export const useLpTokenPrice = (symbol: string) => {
//   const farm = useFarmFromLpSymbol(symbol)
//   const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid)
//   let lpTokenPrice = BIG_ZERO

//   if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
//     // Total value of base token in LP
//     const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(
//       farm.tokenAmountTotal
//     )
//     // Double it to get overall value in LP
//     const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
//     // Divide total value of all tokens, by the number of LP tokens
//     const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
//     lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
//   }

//   return lpTokenPrice
// }

// // Pools

// export const useFetchPublicPoolsData = () => {
//   const dispatch = useAppDispatch()
//   const { slowRefresh } = useRefresh()

//   useEffect(() => {
//     const fetchPoolsPublicData = async () => {
//       const blockNumber = await web3NoAccount.eth.getBlockNumber()
//       dispatch(fetchPoolsPublicDataAsync(blockNumber))
//     }

//     fetchPoolsPublicData()
//     dispatch(fetchPoolsStakingLimitsAsync())
//   }, [dispatch, slowRefresh])
// }

// export const usePools = (
//   account
// ): { pools: Pool[]; userDataLoaded: boolean } => {
//   const { fastRefresh } = useRefresh()
//   const dispatch = useAppDispatch()
//   useEffect(() => {
//     if (account) {
//       dispatch(fetchPoolsUserDataAsync(account))
//     }
//   }, [account, dispatch, fastRefresh])

//   const { pools, userDataLoaded } = useSelector((state: State) => ({
//     pools: state.pools.data,
//     userDataLoaded: state.pools.userDataLoaded,
//   }))
//   return { pools: pools.map(transformPool), userDataLoaded }
// }

// export const usePoolFromPid = (sousId: number): Pool => {
//   const pool = useSelector((state: State) =>
//     state.pools.data.find((p) => p.sousId === sousId)
//   )
//   return transformPool(pool)
// }

// // Price
export const usePriceSevnUsdt = (): BigNumber | undefined => {
  const sevnUsdtFarm = useFarmFromPid(0)

  if (sevnUsdtFarm?.token.usdtPrice) {
    return new BigNumber(sevnUsdtFarm.token.usdtPrice)
  }
}

// // Block
// export const useBlock = () => {
//   return useSelector((state: State) => state.block)
// }

// export const useInitialBlock = () => {
//   return useSelector((state: State) => state.block.initialBlock)
// }
