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
  ManageTokens,
} from 'components'
import { borderRadius, colors, getTransparentColor, shadows } from 'styles'
import { TokenDTO } from 'types'
import { Currency, Token } from 'packages/swap-sdk'
import { useUSDTCurrencyAmount } from 'hooks'
import { formatNumber, getTokenUrlByAddress } from 'utils'

import QUESTION_MARK_icon from 'assets/coins/QUESTION_MARK.png'

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
  tokenAddress?: string
  amount: string
  icon?: string
  onInput: (value: string) => void
  onSelectToken: (value: Currency) => void
}

export const TokenInput: FC<ITokenInputProps> = ({
  title,
  tokenName,
  tokenAddress,
  amount,
  icon,
  onSelectToken,
  onInput,
  currency,
}) => {
  const { t } = useTranslation()

  const modalRef = useRef<TModal>(null)
  const manageTokensRef = useRef<TModal>(null)

  const handleOnInput = (e: string) => {
    onInput(e)
  }

  const handleOnSelect = (value: Currency) => {
    onSelectToken(value)
    modalRef.current?.close()
  }

  const handleOnBack = () => {
    modalRef.current?.open()
    manageTokensRef.current?.close()
  }

  const handleManageTokensOpen = () => {
    modalRef.current?.close()
    manageTokensRef.current?.open()
  }

  const amountInDollar = useUSDTCurrencyAmount(
    currency,
    Number.isFinite(+amount) ? Number(amount) : undefined
  )

  return (
    <>
      <Modal ref={modalRef} title={t('selectToken.selectToken')}>
        <SelectToken
          onSelect={handleOnSelect}
          onManageTokens={handleManageTokensOpen}
        />
      </Modal>
      <Modal ref={manageTokensRef} title={t('manageTokens')}>
        <ManageTokens goBack={handleOnBack} />
      </Modal>
      <StyledRoot>
        {title && <StyledTitle>{title}</StyledTitle>}
        <StyledBlock>
          <StyledBlockTop>
            <TokenSelector
              title={tokenName}
              icon={icon ? icon : getTokenUrlByAddress(tokenAddress)}
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
