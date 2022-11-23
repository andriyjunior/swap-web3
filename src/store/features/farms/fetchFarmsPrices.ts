import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { Farm } from 'store/types'

const getFarmFromTokenSymbol = (
  farms: Farm[],
  tokenSymbol: string,
  preferredQuoteTokens?: string[]
): Farm => {
  const farmsWithTokenSymbol = farms.filter(
    (farm) => farm.token.symbol === tokenSymbol
  )
  const filteredFarm = filterFarmsByQuoteToken(
    farmsWithTokenSymbol,
    preferredQuoteTokens
  )
  return filteredFarm
}

const getFarmBaseTokenPrice = (
  farm: Farm,
  quoteTokenFarm: Farm,
  ethPriceUsdt: BigNumber
): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.tokenPriceVsQuote && farm.quoteToken.symbol === 'USDT') {
    return hasTokenPriceVsQuote
      ? new BigNumber(farm.tokenPriceVsQuote)
      : BIG_ZERO
  }

  //TODO: check WETH or ETH
  if (farm.tokenPriceVsQuote && farm.quoteToken.symbol === 'WETH') {
    return hasTokenPriceVsQuote
      ? ethPriceUsdt.times(farm.tokenPriceVsQuote)
      : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for USDT/ETH farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't USDT or WETH, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (
    quoteTokenFarm.tokenPriceVsQuote &&
    quoteTokenFarm.quoteToken.symbol === 'WETH'
  ) {
    const quoteTokenInBusd = ethPriceUsdt.times(
      quoteTokenFarm.tokenPriceVsQuote
    )
    return hasTokenPriceVsQuote && quoteTokenInBusd && farm.tokenPriceVsQuote
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (farm.tokenPriceVsQuote && quoteTokenFarm.quoteToken.symbol === 'USDT') {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (
  farm: Farm,
  quoteTokenFarm: Farm,
  ethPriceUsdt: BigNumber
): BigNumber => {
  if (farm.quoteToken.symbol === 'USDT') {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === 'WETH') {
    return ethPriceUsdt
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'WETH') {
    return quoteTokenFarm.tokenPriceVsQuote
      ? ethPriceUsdt.times(quoteTokenFarm.tokenPriceVsQuote)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'USDT') {
    return quoteTokenFarm.tokenPriceVsQuote
      ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote)
      : BIG_ZERO
  }

  return BIG_ZERO
}

const fetchFarmsPrices = async (farms) => {
  //TODO: change to USDT-ETH pid
  const ethUsdtFarm = farms.find((farm: Farm) => farm.pid === 0)
  const ethPriceUsdt = ethUsdtFarm.tokenPriceVsQuote
    ? BIG_ONE.div(ethUsdtFarm.tokenPriceVsQuote)
    : BIG_ZERO

  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    const baseTokenPrice = getFarmBaseTokenPrice(
      farm,
      quoteTokenFarm,
      ethPriceUsdt
    )
    const quoteTokenPrice = getFarmQuoteTokenPrice(
      farm,
      quoteTokenFarm,
      ethPriceUsdt
    )
    const token = { ...farm.token, usdtPrice: baseTokenPrice.toJSON() }
    const quoteToken = {
      ...farm.quoteToken,
      usdtPrice: quoteTokenPrice.toJSON(),
    }
    return { ...farm, token, quoteToken }
  })

  return farmsWithPrices
}

export default fetchFarmsPrices
