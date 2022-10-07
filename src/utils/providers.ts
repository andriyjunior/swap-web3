import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const INFURA_URL =
  'https://goerli.infura.io/v3/4552c612a013432d9e30ea7f66715508'

export const infuraProvider = new StaticJsonRpcProvider(INFURA_URL)

export default null
