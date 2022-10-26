import { Contract } from '@ethersproject/contracts'
import ERC20_ABI from 'abis/erc20.json'
import SevnPair from 'abis/SevnPair.json'
import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json'
import { Erc20, Erc20Bytes32, ISevnPair, Multicall } from 'abis'
import { getContract, getMulticallAddress, getProviderOrSigner } from 'utils'
import multiCallAbi from 'abis/Multicall.json'
import { ChainId, WNATIVE } from 'packages/swap-sdk'
import { infuraProvider } from 'utils'
import { Weth } from 'abis/types/Weth'

import WETH_ABI from 'abis/weth.json'
import { useActiveWeb3React } from './useActiveWeb3React'

function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  if (!account || !library) return null

  const signer = withSignerIfPossible
    ? getProviderOrSigner(library, account)
    : library

  const canReturnContract =
    address && ABI && (withSignerIfPossible ? library : true)

  if (!canReturnContract || !address) return null

  try {
    return getContract(address, ABI, signer) as T
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract<Erc20Bytes32>(
    tokenAddress,
    ERC20_BYTES32_ABI,
    withSignerIfPossible
  )
}

export function useMulticallContract() {
  const { chainId } = useActiveWeb3React()
  return useContract<Multicall>(
    getMulticallAddress(chainId),
    multiCallAbi,
    false
  )
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean
): ISevnPair | null {
  return useContract(pairAddress, SevnPair.abi, withSignerIfPossible)
}

export const useWETHContract = (
  withSignerIfPossible?: boolean
): Contract | null => {
  const { chainId } = useActiveWeb3React()
  return useContract<Weth>(
    chainId ? WNATIVE[chainId].address : undefined,
    WETH_ABI,
    withSignerIfPossible
  )
}
