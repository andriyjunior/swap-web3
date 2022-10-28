import { ChainId, WETH9 } from 'packages/swap-sdk'
import ETH_icon from 'assets/coins/ETH.png'
import SEVN_icon from 'assets/coins/SEVN.png'
import USDT_icon from 'assets/coins/USDT.png'
import { SEVN, USDT } from 'const'

export const BAD_SRCS: { [imageSrc: string]: true } = {}

const icons = {
  ['0xf4B56E5c91eCA28393e76949aa584176da3E3a77']:
    'images/icons/test_token_1.png',
  ['0x3da6E51A427Adf7335970f816dDa26b3b47C0aF8']:
    'images/icons/test_token_2.png',
  ['0xb7459B9530EeB74E913d94d1a58B39bA98642F9f']:
    'images/icons/test_token_3.png',
  ['0xDc81cc1C6759eB4b51612f4cc2a14d64367A917F']:
    'images/icons/test_token_4.png',
  ['0x95b2239047e495E5FdB0ec614bA03e7c1a45309C']: 'images/icons/USDT.png',
  ['0xB97ba66758584b7C3F10267F6CC0cA6a4abDc3e5']: 'images/icons/SEVN.png',
}

export const getTokenUrlByAddress = (address) => {
  if (icons[address]) {
    return icons[address]
  }

  if (
    address?.toLowerCase().includes('eth') ||
    address === WETH9[ChainId.MAINNET].address ||
    address === WETH9[ChainId.TESTNET].address
  ) {
    return ETH_icon
  } else {
    return `https://pancakeswap.finance/images/tokens/${address}.png`
  }
}
