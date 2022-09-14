import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {
  Typography,
  TokenSelector,
  BigDecimalInput,
  TModal,
  Modal,
  SelectToken,
} from 'components'
import { borderRadius, colors, getTransparentColor, shadows } from 'styles'
import { TokenDTO } from 'types'
import { Currency, Token } from 'packages/swap-sdk'
import { useUSDTCurrencyAmount } from 'hooks'
import { formatNumber } from 'utils'

const StyledRoot = styled.div`
  padding: 18px 0;
`

const StyledBlock = styled.div`
  padding: 20px 10px;
  box-shadow: ${shadows.inner};
  background-color: ${colors.white};
  border: 1px solid ${getTransparentColor(colors.black, 0.05)};
  border-radius: ${borderRadius.primary};
`

const StyledTitle = styled(Typography.Caption)`
  padding-bottom: 10px;
`

const StyledBlockTop = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledText = styled(Typography.Caption)`
  padding: 10px 0;
  text-align: right;
  color: ${getTransparentColor(colors.black, 0.5)};
  opacity: 0.5;
`

interface ITokenInputProps {
  currency?: Currency
  title?: string
  tokenName: string
  amount: string
  icon: string
  onInput: (value: string) => void
  onSelectToken: (value: Token) => void
}

export const TokenInput: FC<ITokenInputProps> = ({
  title,
  tokenName,
  amount,
  icon,
  onSelectToken,
  onInput,
  currency,
}) => {
  const { t } = useTranslation()

  const modalRef = useRef<TModal>(null)

  const handleOnInput = (e: string) => {
    onInput(e)
  }

  const handleOnSelect = (value: Token) => {
    onSelectToken(value)
    modalRef.current?.close()
  }

  const amountInDollar = useUSDTCurrencyAmount(currency, Number(amount))

  return (
    <>
      <Modal ref={modalRef} title={t('selectToken.selectToken')}>
        <SelectToken onSelect={handleOnSelect} />
      </Modal>
      <StyledRoot>
        {title && <StyledTitle>{title}</StyledTitle>}
        <StyledBlock>
          <StyledBlockTop>
            <TokenSelector
              title={tokenName}
              icon={icon}
              onClick={() => modalRef.current?.open()}
              hasArrow
            />
            <BigDecimalInput value={amount} onInput={handleOnInput} />
          </StyledBlockTop>
          <StyledText>
            ~${amountInDollar && formatNumber(amountInDollar)}
          </StyledText>
        </StyledBlock>
      </StyledRoot>
    </>
  )
}
