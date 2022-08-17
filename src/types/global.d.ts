import { ethers } from 'ethers'
/* eslint-disable no-var */

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider
  }
}

export {}
