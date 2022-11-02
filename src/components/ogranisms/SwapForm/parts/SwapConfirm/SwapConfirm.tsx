import { FC, ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'
import BNB_icon from 'assets/coins/BNB.png'
import {
  Button,
  HorizontalSeparator,
  Icon,
  Typography,
  Coin,
  Tooltip,
} from 'components'
import { useTranslation } from 'react-i18next'
import { colors, getTransparentColor } from 'styles'
import { Trade, TradeType } from 'packages/swap-sdk'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from 'utils'
import { selectUserSlippageTolerance, useAppSelector } from 'store'
import { ONE_BIPS } from 'config'
import { Field } from 'store/features/swap/actions'

import arrows_icon from 'assets/icons/blue-arrows.svg'
import info_icon from 'assets/icons/info.svg'

const StyledCurrencies = styled.div``

const StyledCurrency = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:last-child {
    padding-top: 16px;
  }
`

const StyledCoinAndAmount = styled.div`
  display: flex;
  align-items: center;
`

const halfBlackCSS = css`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledDescription = styled(Typography.Body)`
  padding-top: 12px;
  ${halfBlackCSS}
`

const StyledAmount = styled(Typography.Header4)<{ hasPaddingLeft?: boolean }>`
  padding-left: ${({ hasPaddingLeft }) => (hasPaddingLeft ? '8px' : '')};
`

const StyledText = styled(Typography.Body)`
  ${halfBlackCSS};
  display: flex;
  align-items: flex-start;
`

const StyledIcon = styled(Icon)`
  padding: 0 8px;
`

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:first-child) {
    padding-top: 22px;
  }
`

const StyledRight = styled.div`
  display: flex;
  align-items: center;
`

const StyledButton = styled.div`
  padding-top: 16px;
`

const errorTextColors = {
  [0]: colors.success,
  [1]: colors.black,
  [2]: colors.warning,
  [3]: colors.error,
  [4]: colors.error,
}

const StyledErrorText = styled(Typography.Body)<{
  severity: 0 | 1 | 2 | 3 | 4
}>`
  color: ${({ severity }) => errorTextColors[severity]};
  opacity: 0.5;
`

interface ISwapConfirmProps {
  originalTrade?: Trade
  attemptingTxn: boolean
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  trade?: Trade
  txHash?: string
  swapErrorMessage?: string
  customOnDismiss?: () => void
  icons: string[]
}

export const SwapConfirm: FC<ISwapConfirmProps> = ({
  onConfirm,
  trade,
  allowedSlippage,
  icons,
}) => {
  const { t } = useTranslation()

  const userSlippage = useAppSelector(selectUserSlippageTolerance)

  const { priceImpactWithoutFee, realizedLPFee } = useMemo(
    () => computeTradePriceBreakdown(trade),
    [trade]
  )

  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade]
  )

  return (
    <>
      <StyledCurrencies>
        <StyledCurrency>
          <StyledCoinAndAmount>
            <Coin width="large" src={icons[0]} />
            <StyledAmount hasPaddingLeft>
              {trade?.inputAmount.toSignificant(6)}
            </StyledAmount>
          </StyledCoinAndAmount>
          <StyledAmount>{trade?.inputAmount.currency.symbol}</StyledAmount>
        </StyledCurrency>
        <StyledCurrency>
          <StyledCoinAndAmount>
            <Coin width="large" src={icons[1]} />
            <StyledAmount hasPaddingLeft>
              {trade?.outputAmount.toSignificant(6)}
            </StyledAmount>
          </StyledCoinAndAmount>
          <Typography.Header4>
            {trade?.outputAmount.currency.symbol}
          </Typography.Header4>
        </StyledCurrency>
      </StyledCurrencies>
      <StyledDescription>
        {t('swapForm.confirmDescription', { percent: userSlippage })}
      </StyledDescription>
      <HorizontalSeparator />
      <StyledRow>
        <StyledText>{t('price')}</StyledText>
        <StyledRight>
          <StyledText>{formatExecutionPrice(trade, false)}</StyledText>
          <Icon src={arrows_icon} />
        </StyledRight>
      </StyledRow>

      <StyledRow>
        {trade && (
          <>
            <StyledText>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? t('swapForm.minimumReceived')
                : t('swapForm.maximumSold')}
              <Tooltip
                text={
                  trade.tradeType === TradeType.EXACT_INPUT
                    ? t('swapForm.minimumReceived')
                    : t('swapForm.maximumSold')
                }
              >
                <StyledIcon src={info_icon} />
              </Tooltip>
            </StyledText>
          </>
        )}
        <StyledRight>
          {trade && (
            <StyledText>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
              &nbsp;
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </StyledText>
          )}
        </StyledRight>
      </StyledRow>

      <StyledRow>
        <StyledText>
          {t('swapForm.priceImpact')}
          <Tooltip text={t('swapForm.priceImpact')}>
            <StyledIcon src={info_icon} />
          </Tooltip>
        </StyledText>
        <StyledRight>
          <StyledErrorText severity={warningSeverity(priceImpactWithoutFee)}>
            {priceImpactWithoutFee
              ? priceImpactWithoutFee.lessThan(ONE_BIPS)
                ? '<0.01%'
                : `${priceImpactWithoutFee.toFixed(2)}%`
              : '-'}
          </StyledErrorText>
        </StyledRight>
      </StyledRow>
      <StyledRow>
        <StyledText>
          {t('swapForm.liquidityProviderFee')}
          <Tooltip text={t('swapForm.liquidityProviderFee')}>
            <StyledIcon src={info_icon} />
          </Tooltip>
        </StyledText>
        <StyledRight>
          {trade && (
            <StyledText>
              {realizedLPFee
                ? `${realizedLPFee?.toSignificant(6)} ${
                    trade?.inputAmount.currency.symbol
                  }`
                : '-'}
            </StyledText>
          )}
        </StyledRight>
      </StyledRow>

      <StyledButton>
        <Button title={t('swapForm.confirmSwap')} onClick={onConfirm} />
      </StyledButton>
    </>
  )
}
