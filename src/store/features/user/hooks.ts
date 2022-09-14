import { ChainId } from 'packages/swap-sdk'
import { useWeb3React } from '@web3-react/core'
import { GAS_PRICE_GWEI } from 'const'
import { selectGasPrice } from 'store/selectors'
import { useAppSelector } from 'store/utils'

export function useGasPrice(): string {
  const { chainId } = useWeb3React()
  const userGas = useAppSelector(selectGasPrice)
  return chainId === ChainId.MAINNET ? userGas : GAS_PRICE_GWEI.testnet
}
