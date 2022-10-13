import { FC, ReactNode } from 'react'
import styled from 'styled-components'
import BNB_icon from 'assets/coins/BNB.png'
import { HorizontalSeparator, Typography } from 'components/atoms'
import { useTranslation } from 'react-i18next'

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

const StyledDescription = styled(Typography.Body)`
  padding-top: 12px;
`

interface ISwapConfirmProps {
  children?: ReactNode
}

export const SwapConfirm: FC<ISwapConfirmProps> = () => {
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
    </>
  )
}
