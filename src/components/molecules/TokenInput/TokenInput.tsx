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
  title?: string
  tokenName: string
  amount: string
  icon: string
  onInput: (value: string) => void
  onSelectToken: (value: TokenDTO) => void
  tokenList: TokenDTO[]
}

export const TokenInput: FC<ITokenInputProps> = ({
  title,
  tokenName,
  amount,
  icon,
  onSelectToken,
  onInput,
  tokenList,
}) => {
  const { t } = useTranslation()

  const modalRef = useRef<TModal>(null)

  const handleOnInput = (e: string) => {
    onInput(e)
  }

  const handleOnSelect = (value: TokenDTO) => {
    onSelectToken(value)
    modalRef.current?.close()
  }

  return (
    <>
      <Modal ref={modalRef} title={t('selectToken.selectToken')}>
        <SelectToken onSelect={handleOnSelect} allTokensList={tokenList} />
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
          <StyledText>~${Number(amount) * 0.23}</StyledText>
        </StyledBlock>
      </StyledRoot>
    </>
  )
}
