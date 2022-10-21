// import { ETH_ADDRESS } from './constants'

// BNB Address
export const ETH_ADDRESS = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'

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
