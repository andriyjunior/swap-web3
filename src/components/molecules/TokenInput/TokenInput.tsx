import { FC, useRef, useState } from 'react'
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

const StyledRoot = styled.div`
  padding: 18px 0;
`

const StyledBlock = styled.div`
  margin-top: 10px;
  padding: 20px 10px;
  box-shadow: ${shadows.inner};
  background-color: ${colors.white};
  border: 1px solid ${getTransparentColor(colors.black, 0.05)};
  border-radius: ${borderRadius.primary};
`

const StyledBlockTop = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledText = styled(Typography.Caption)`
  padding-top: 10px;
  text-align: right;
  color: ${getTransparentColor(colors.black, 0.5)};
  opacity: 0.5;
`

interface ITokenInputProps {
  title: string
}

export const TokenInput: FC<ITokenInputProps> = ({ title }) => {
  const { t } = useTranslation()
  const [input, setInput] = useState('')

  const modalRef = useRef<TModal>(null)

  return (
    <>
      <Modal ref={modalRef} title={t('selectToken.selectToken')}>
        <SelectToken />
      </Modal>
      <StyledRoot>
        <Typography.Caption>{title}</Typography.Caption>
        <StyledBlock>
          <StyledBlockTop>
            <TokenSelector
              title={''}
              icon={''}
              onClick={() => modalRef.current?.open()}
            />
            <BigDecimalInput value={input} onInput={(e) => setInput(e)} />
          </StyledBlockTop>
          <StyledText>~${Number(input) * 0.23}</StyledText>
        </StyledBlock>
      </StyledRoot>
    </>
  )
}
