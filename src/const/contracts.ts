import { ChainId } from 'packages/swap-sdk'

export default {
  multiCall: {
    [ChainId.MAINNET]: '0x1F98415757620B543A52E61c46B32eB19261F984',
    [ChainId.TESTNET]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  },
  masterChef: {
    [ChainId.MAINNET]: '0xbe515C32E501C6A8Ebb52f13EbAd9F2333739fbA',
    [ChainId.TESTNET]: '0xbe515C32E501C6A8Ebb52f13EbAd9F2333739fbA',
  },
}
