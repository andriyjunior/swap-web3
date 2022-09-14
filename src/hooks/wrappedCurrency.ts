import {
  ChainId,
  Currency,
  CurrencyAmount,
  ETHER,
  Token,
  WNATIVE,
  TokenAmount,
  WETH9,
} from 'packages/swap-sdk'
import { WETH } from 'const'

export function wrappedCurrency(
  currency: Currency | undefined,
  chainId: ChainId | undefined
): Token | undefined {
  return chainId && currency === ETHER
    ? WNATIVE[chainId]
    : currency instanceof Token
    ? currency
    : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token =
    currencyAmount && chainId
      ? wrappedCurrency(currencyAmount.currency, chainId)
      : undefined
  return token && currencyAmount
    ? new TokenAmount(token, currencyAmount.raw)
    : undefined
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(WETH9[token.chainId])) return ETHER
  return token
}
