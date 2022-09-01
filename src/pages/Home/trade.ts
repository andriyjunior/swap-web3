import {
  ChainId,
  Token,
  TokenAmount,
  CurrencyAmount,
  Fetcher,
  WETH,
  Pair,
  Route,
  Trade,
  TradeType,
  Percent,
} from '@uniswap/sdk'

const tryTrade = async () => {
  const chainId = ChainId.MAINNET

  const USDC = new Token(
    ChainId.MAINNET,
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    6
  )
  const DAI = new Token(
    ChainId.MAINNET,
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    18
  )

  const pairs = new Pair(
    new TokenAmount(USDC, '1000000'),
    new TokenAmount(DAI, '1000000')
  )

  const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])

  const route = new Route([pair], WETH[DAI.chainId])

  const amountIn = '1000000000000000000' // 1 WETH

  const trade = new Trade(
    route,
    new TokenAmount(WETH[DAI.chainId], amountIn),
    TradeType.EXACT_INPUT
  )

  const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%

  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
  const path = [WETH[DAI.chainId].address, DAI.address]
  const to = '' // should be a checksummed recipient address
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
  const value = trade.inputAmount.raw
}

export default tryTrade
