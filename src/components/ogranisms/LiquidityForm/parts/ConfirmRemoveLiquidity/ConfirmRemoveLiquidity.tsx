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

const StyledCoin = styled.div`
  margin-left: 10px;
`

const StyledCoinPair = styled.div`
  width: 94px;
`

interface IConfirmRemoveLiquidity {
  currencies: { [field in Field]?: Currency }
  amounts: { [x: string]: string }
  onSupply: () => void
  liquidityMinted?: TokenAmount
  icons: string[]
}

export const ConfirmRemoveLiquidity: FC<IConfirmRemoveLiquidity> = ({
  currencies,
  amounts,
  onSupply,
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
        {t('burned')}
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
          <StyledCoin>
            <Coin src={icons[0]} />
          </StyledCoin>
        </Flex>
      </StyledTextRow>

      <StyledTextRow alignItems="center" justifyContent="space-between">
        <StyledText>
          {currencies[Field.CURRENCY_B]?.symbol ?? ''}&nbsp; {t('deposited')}:
        </StyledText>
        <Flex alignItems="center">
          <StyledText>{amounts[Field.CURRENCY_B]}</StyledText>
          <StyledCoin>
            <Coin src={icons[1]} />
          </StyledCoin>
        </Flex>
      </StyledTextRow>

      <StyledButton>
        <Button title={t('confirm')} onClick={onSupply} />
      </StyledButton>
    </>
  )
}
