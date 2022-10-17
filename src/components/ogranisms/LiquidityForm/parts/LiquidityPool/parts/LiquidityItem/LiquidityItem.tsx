import { Accordion, Button, CoinPair, Flex, Typography } from 'components'
import { FC } from 'react'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'
import { JSBI, Pair, Percent } from 'packages/swap-sdk'

import icon_BNB from 'assets/coins/BNB.png'
import icon_USDT from 'assets/coins/Tether.png'
import { useNavigate } from 'react-router-dom'
import { paths } from 'const'
import { useTranslation } from 'react-i18next'
import { useTotalSupply, useUSDTPrice } from 'hooks'
import { useTokenBalance } from 'store'
import { multiplyPriceByAmount } from 'utils'
import { useWeb3React } from '@web3-react/core'

const StyledPairTitle = styled(Typography.Body)`
  padding-left: 16px;
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledButtons = styled(Flex)`
  padding-top: 10px;
  gap: 10px;
`

const StyledTextRow = styled(Flex)`
  margin-top: 10px;
  height: 24px;
`

const StyledText = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledCoinWrapper = styled.span`
  padding-left: 10px;
`

const StyledCoinIcon = styled.img`
  width: 24px;
  height: 24px;
`

const state = {
  inputToken: {
    logoURI: icon_USDT,
    symbol: 'USDT',
  },

  outputToken: {
    logoURI: icon_BNB,
    symbol: 'BNB',
  },
}

interface ILiquidityItemProps {
  pair?: Pair | null
}

const useLPValues = (account, pair, currency0, currency1) => {
  const token0Price = useUSDTPrice(currency0)
  const token1Price = useUSDTPrice(currency1)

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  )
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
        ]
      : [undefined, undefined]

  const token0USDValue =
    token0Deposited && token0Price
      ? multiplyPriceByAmount(
          token0Price,
          parseFloat(token0Deposited.toSignificant(6))
        )
      : null
  const token1USDValue =
    token1Deposited && token1Price
      ? multiplyPriceByAmount(
          token1Price,
          parseFloat(token1Deposited.toSignificant(6))
        )
      : null
  const totalUSDValue =
    token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null

  return {
    token0Deposited,
    token1Deposited,
    totalUSDValue,
    poolTokenPercentage,
    userPoolBalance,
  }
}

export const LiquidityItem: FC<ILiquidityItemProps> = ({ pair }) => {
  const { t } = useTranslation()

  const { account } = useWeb3React()

  const navigate = useNavigate()

  const handleOnRemove = () => {
    navigate(paths.removeLiquidity(pair?.token0.address, pair?.token1.address))
  }

  const handleOnAdd = () => {
    navigate(paths.addLiquidity(pair?.token0.address, pair?.token1.address), {
      replace: true,
    })
  }

  const {
    totalUSDValue,
    poolTokenPercentage,
    token0Deposited,
    token1Deposited,
    userPoolBalance,
  } = useLPValues(account, pair, pair?.token0, pair?.token1)

  return (
    <>
      <Accordion
        hasArrow
        element={
          <Flex alignItems="center">
            <CoinPair
              inputToken={state.inputToken.logoURI}
              outputToken={state.outputToken.logoURI}
            />
            <StyledPairTitle>
              {pair?.token0.symbol}/{pair?.token1.symbol}
            </StyledPairTitle>
          </Flex>
        }
      >
        <StyledTextRow justifyContent="space-between" alignItems="center">
          <StyledText>
            {t('liquidityForm.pooled')}&nbsp;
            {pair?.token0.symbol}:
          </StyledText>
          <Flex justifyContent="space-between" alignItems="center">
            {token0Deposited && (
              <StyledText>{token0Deposited?.toSignificant(6)}</StyledText>
            )}
            <StyledCoinWrapper>
              <StyledCoinIcon src={state.inputToken.logoURI} />
            </StyledCoinWrapper>
          </Flex>
        </StyledTextRow>

        <StyledTextRow justifyContent="space-between" alignItems="center">
          <StyledText>
            {t('liquidityForm.pooled')}&nbsp;
            {pair?.token1.symbol}:
          </StyledText>
          <Flex justifyContent="space-between" alignItems="center">
            {token1Deposited && (
              <StyledText>{token1Deposited?.toSignificant(6)}</StyledText>
            )}
            <StyledCoinWrapper>
              <StyledCoinIcon src={state.outputToken.logoURI} />
            </StyledCoinWrapper>
          </Flex>
        </StyledTextRow>

        <StyledTextRow justifyContent="space-between" alignItems="center">
          <StyledText>{t('liquidityForm.yourPoolTokens')}</StyledText>
          <StyledText>{userPoolBalance?.toSignificant(4)}</StyledText>
        </StyledTextRow>
        <StyledTextRow justifyContent="space-between" alignItems="center">
          <StyledText>{t('liquidityForm.yourPoolShare')}</StyledText>
          <StyledText>
            {' '}
            {poolTokenPercentage
              ? `${
                  poolTokenPercentage.toFixed(2) === '0.00'
                    ? '<0.01'
                    : poolTokenPercentage.toFixed(2)
                }%`
              : '-'}
          </StyledText>
        </StyledTextRow>

        <StyledButtons>
          <Button title={t('add')} onClick={handleOnAdd} />
          <Button title={t('remove')} onClick={handleOnRemove} />
        </StyledButtons>
      </Accordion>
    </>
  )
}
