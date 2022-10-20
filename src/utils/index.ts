import { Web3Provider, JsonRpcSigner, Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { isAddress } from './isAddress'
import { BigNumber, Signer } from 'ethers'
import { BASE_BSC_SCAN_URLS } from 'config'
import { ChainId } from 'packages/swap-sdk'

export * from './isDev'
export * from './getTokenList'
export * from './uriToHttp'
export * from './sliceAccAddress'
export * from './isAddress'
export * from './addressHelpers'
export * from './tryParseAmount'
export * from './providers'
export * from './maxAmountSpend'
export * from './currencyId'
export * from './prices'
export * from './formatBalance'
export * from './exchange'
export * from './wallet'
export * from './web3React'
export * from './isUndefinedOrNull'
export * from './serializeTokens'
export * from './isZero'
export * from './transactionErrorToUserReadableMessage'
export * from './truncateHash'
export * from './localStorageOrders'
export * from './getTokenUrlByAddress'

export const AddressZero = '0x0000000000000000000000000000000000000000'

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function getContract(
  address: string,
  ABI: any,
  signer?: Signer | Provider
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, signer)
}

// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// add 10%
export function calculateGasMargin(value: BigNumber, margin = 1000): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(margin)))
    .div(BigNumber.from(10000))
}

export function getBscScanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainIdOverride?: number
): string {
  const chainId = chainIdOverride || ChainId.MAINNET
  switch (type) {
    case 'transaction': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/tx/${data}`
    }
    case 'token': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/token/${data}`
    }
    case 'block': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/${data}`
    }
    case 'countdown': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/countdown/${data}`
    }
    default: {
      return `${BASE_BSC_SCAN_URLS[chainId]}/address/${data}`
    }
  }
}
