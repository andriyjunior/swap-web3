import {
  Typography,
  Flex,
  CoinPair,
  HorizontalSeparator,
  Button,
  Coin,
} from 'components'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'

import bnb from 'assets/coins/BNB.png'
import { FC } from 'react'
import { Field } from 'types'
import { Currency, CurrencyAmount, Price, TokenAmount } from 'packages/swap-sdk'
import { selectUserSlippageTolerance, useAppSelector } from 'store'

const StyledButton = styled.div`
  padding: 24px 0 16px;
`

const StyledLiquidityMinted = styled(Typography.Header3)`
  min-width: 0;
`

const StyledTextRow = styled(Flex)`
  padding-top: 24px;
  padding-right: 18px;
`

const StyledText = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledCoinPair = styled.div`
  width: 72px;
`

const state = {
  inputToken: 'BNB',
  outputToken: 'USDT',
}

interface IConfirmSupply {
  currencies: { [field in Field]?: Currency }
  amounts: { [x: string]: string }
  onSupply: () => void
  shareOfPool: string
  price?: Price
  liquidityMinted?: TokenAmount
  icons: string[]
}

export const ConfirmSupply: FC<IConfirmSupply> = ({
  currencies,
  amounts,
  onSupply,
  shareOfPool,
  price,
  liquidityMinted,
  icons,
}) => {
  const { t } = useTranslation()

  const userSlippage = useAppSelector(selectUserSlippageTolerance)

  return (
    <>
      <Flex justifyContent="space-between">
        <StyledLiquidityMinted>
          {liquidityMinted?.toSignificant(6)}
        </StyledLiquidityMinted>
        <StyledCoinPair>
          <CoinPair size="large" inputToken={icons[0]} outputToken={icons[1]} />
        </StyledCoinPair>
      </Flex>
      <Typography.Title>
        {currencies[Field.CURRENCY_A]?.symbol}/
        {currencies[Field.CURRENCY_B]?.symbol}&nbsp;
        {t('confirmSupply.poolTokens')}
      </Typography.Title>
      <StyledText>
        {t('confirmSupply.outputIsEstimated', { percent: userSlippage })}
      </StyledText>
      <HorizontalSeparator />

      <StyledTextRow alignItems="center" justifyContent="space-between">
        <StyledText>
          {currencies[Field.CURRENCY_A]?.symbol ?? ''}&nbsp; {t('deposited')}:
        </StyledText>
        <Flex alignItems="center">
          <StyledText>{amounts[Field.CURRENCY_A]}</StyledText>
          <Coin src={icons[0]} />
        </Flex>
      </StyledTextRow>

      <StyledTextRow alignItems="center" justifyContent="space-between">
        <StyledText>
          {currencies[Field.CURRENCY_B]?.symbol ?? ''}&nbsp; {t('deposited')}:
        </StyledText>
        <Flex alignItems="center">
          <StyledText>{amounts[Field.CURRENCY_B]}</StyledText>
          <Coin src={icons[1]} />
        </Flex>
      </StyledTextRow>

      <StyledTextRow alignItems="flex-start" justifyContent="space-between">
        <StyledText>{t('rates')}:</StyledText>
        <Flex alignItems="flex-end" flexDirection="column">
          <StyledText>
            1&nbsp;{currencies[Field.CURRENCY_A]?.symbol}&nbsp;=&nbsp;
            {price?.toSignificant(6)}&nbsp;
            {currencies[Field.CURRENCY_B]?.symbol}
          </StyledText>
          <StyledText>
            1&nbsp;{currencies[Field.CURRENCY_B]?.symbol}&nbsp;=&nbsp;
            {price?.invert().toSignificant(6)}&nbsp;
            {currencies[Field.CURRENCY_A]?.symbol}
          </StyledText>
        </Flex>
      </StyledTextRow>

      <StyledTextRow alignItems="center" justifyContent="space-between">
        <StyledText>{t('confirmSupply.shareOfPool')}:</StyledText>
        <StyledText>{shareOfPool}%</StyledText>
      </StyledTextRow>

      <StyledButton>
        <Button title={t('confirmSupply.confirmSupply')} onClick={onSupply} />
      </StyledButton>
    </>
  )
}
