import { ethers } from 'ethers'
/* eslint-disable no-var */

declare global {
  interface Window {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    ethereum?: ethers.providers.ExternalProvider & { on: any }
  }
}

export {}
