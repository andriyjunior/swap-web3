import { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import BNB_icon from 'assets/coins/BNB.png'
import { Button, HorizontalSeparator, Typography } from 'components/atoms'
import { useTranslation } from 'react-i18next'
import { colors, getTransparentColor } from 'styles'

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

const StyledCoin = styled.img`
  margin-right: 16px;
  width: 48px;
  height: 48px;
`

const halfBlackCSS = css`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledDescription = styled(Typography.Body)`
  padding-top: 12px;
  ${halfBlackCSS}
`

const StyledText = styled(Typography.Body)`
  ${halfBlackCSS}
`

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:first-child) {
    padding-top: 22px;
  }
`

const StyledRight = styled.div``

const StyledButton = styled.div`
  padding-top: 16px;
`

interface ISwapConfirmProps {
  children?: ReactNode
  onConfirm: () => void
}

export const SwapConfirm: FC<ISwapConfirmProps> = ({ onConfirm }) => {
  const { t } = useTranslation()

  return (
    <>
      <StyledCurrencies>
        <StyledCurrency>
          <StyledCoinAndAmount>
            <StyledCoin src={BNB_icon} />
            <Typography.Header4>0.02346234</Typography.Header4>
          </StyledCoinAndAmount>
          <Typography.Header4>BNB</Typography.Header4>
        </StyledCurrency>
        <StyledCurrency>
          <StyledCoinAndAmount>
            <StyledCoin src={BNB_icon} />
            <Typography.Header4>0.02346234</Typography.Header4>
          </StyledCoinAndAmount>
          <Typography.Header4>BNB</Typography.Header4>
        </StyledCurrency>
      </StyledCurrencies>
      <StyledDescription>
        {t('swapForm.confirmDescription', { percent: '0.5' })}
      </StyledDescription>
      <HorizontalSeparator />
      <StyledRow>
        <StyledText>{t('price')}</StyledText>
      </StyledRow>

      <StyledRow>
        <StyledText>{t('swapForm.minimumReceived')}</StyledText>
        <StyledRight>
          <StyledText>0.0011134 MANA</StyledText>
        </StyledRight>
      </StyledRow>

      <StyledRow>
        <StyledText>{t('swapForm.priceImpact')}</StyledText>
        <StyledRight>
          <StyledText>0.01%</StyledText>
        </StyledRight>
      </StyledRow>
      <StyledRow>
        <StyledText>{t('swapForm.liquidityProviderFee')}</StyledText>
        <StyledRight>
          <StyledText>0.00000075 BNB</StyledText>
        </StyledRight>
      </StyledRow>

      <StyledButton>
        <Button title={t('swapForm.confirmSwap')} onClick={onConfirm} />
      </StyledButton>
    </>
  )
}
