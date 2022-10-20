import { ChainId, WETH9 } from 'packages/swap-sdk'
import ETH_icon from 'assets/coins/ETH.png'
import SEVN_icon from 'assets/coins/SEVN.png'
import { SEVN } from 'const'

export const getTokenUrlByAddress = (address) => {
  if (
    address?.toLowerCase().includes('eth') ||
    address === WETH9[ChainId.MAINNET].address ||
    address === WETH9[ChainId.TESTNET].address
  ) {
    return ETH_icon
  }

  if (
    address === SEVN[ChainId.MAINNET].address ||
    address === SEVN[ChainId.TESTNET].address
  ) {
    return SEVN_icon
  } else {
    return `https://pancakeswap.finance/images/tokens/${address}.png`
  }
}
