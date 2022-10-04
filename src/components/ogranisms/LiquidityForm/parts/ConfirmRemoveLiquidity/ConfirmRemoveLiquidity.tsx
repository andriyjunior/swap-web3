import {
  Typography,
  Flex,
  CoinPair,
  HorizontalSeparator,
  Button,
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

const StyledCoin = styled.img`
  margin-left: 10px;
  width: 24px;
  height: 24px;
`

const StyledCoinPair = styled.div`
  width: 94px;
`

interface IConfirmRemoveLiquidity {
  currencies: { [field in Field]?: Currency }
  amounts: { [x: string]: string }
  onSupply: () => void
  liquidityMinted?: TokenAmount
}

export const ConfirmRemoveLiquidity: FC<IConfirmRemoveLiquidity> = ({
  currencies,
  amounts,
  onSupply,
  liquidityMinted,
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
          <CoinPair size="large" inputToken={bnb} outputToken={bnb} />
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
          <StyledCoin src={bnb} />
        </Flex>
      </StyledTextRow>

      <StyledTextRow alignItems="center" justifyContent="space-between">
        <StyledText>
          {currencies[Field.CURRENCY_B]?.symbol ?? ''}&nbsp; {t('deposited')}:
        </StyledText>
        <Flex alignItems="center">
          <StyledText>{amounts[Field.CURRENCY_B]}</StyledText>
          <StyledCoin src={bnb} />
        </Flex>
      </StyledTextRow>

      <StyledButton>
        <Button title={t('confirm')} onClick={onSupply} />
      </StyledButton>
    </>
  )
}
