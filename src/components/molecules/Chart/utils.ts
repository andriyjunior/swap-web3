import { ETH_ADDRESS } from './constants'

export const getTokenAddress = (tokenAddress: undefined | string) => {
  if (!tokenAddress) {
    return ''
  }
  const lowerCaseAddress = tokenAddress.toLowerCase()
  if (lowerCaseAddress === 'eth') {
    return ETH_ADDRESS
  }

  return lowerCaseAddress
}
