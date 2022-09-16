import { Web3Provider, JsonRpcSigner, Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { isAddress } from './isAddress'
import { Signer } from 'ethers'

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
