import { Caption, TokenSelector } from 'components'
import { FC, useState } from 'react'
import styled from 'styled-components'
import { borderRadius, colors, getTransparentColor, shadows } from 'styles'
import { escapeRegExp } from 'utils'

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

const StyledInput = styled.input`
  background-color: none;
  border: none;
  font-weight: 700;
  font-size: 26px;
  text-align: right;

  &:focus {
    outline: none;
  }
`

const StyledText = styled(Caption)`
  padding-top: 10px;
  text-align: right;
  color: ${getTransparentColor(colors.black, 0.5)};
  opacity: 0.5;
`

interface ITokenInputProps {
  title: string
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const TokenInput: FC<ITokenInputProps> = ({ title }) => {
  const [input, setInput] = useState('')

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setInput(nextUserInput)
    }
  }

  const handleOnInput = (e: string) => {
    enforcer(e.replace(/,/g, '.'))
  }

  return (
    <StyledRoot>
      <Caption>{title}</Caption>
      <StyledBlock>
        <StyledBlockTop>
          <TokenSelector title={''} icon={''} onClick={() => {}} />
          <StyledInput
            inputMode="decimal"
            placeholder="0.0"
            pattern="^[0-9]*[.,]?[0-9]*$"
            value={input}
            minLength={1}
            maxLength={79}
            onInput={(e) => handleOnInput(e.currentTarget.value)}
          />
        </StyledBlockTop>
        <StyledText>~${Number(input) * 0.23}</StyledText>
      </StyledBlock>
    </StyledRoot>
  )
}
