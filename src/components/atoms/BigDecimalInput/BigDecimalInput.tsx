import { FC } from 'react'
import styled from 'styled-components'
import { escapeRegExp } from 'utils'
import { inputRegex } from '../utils'

type TTextAlign = 'left' | 'center' | 'right'

const StyledInput = styled.input<{ textAlign: TTextAlign }>`
  background-color: none;
  border: none;
  font-weight: 700;
  font-size: 26px;
  text-align: ${({ textAlign }) => textAlign};
  width: 100%;

  &:focus {
    outline: none;
  }
`

interface IBigDecimalInput {
  value: string | number
  onInput: (e: string) => void
  textAlign?: TTextAlign
  maxLength?: number
}

export const BigDecimalInput: FC<IBigDecimalInput> = ({
  value,
  onInput,
  textAlign = 'right',
  maxLength = 79,
}) => {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onInput(nextUserInput)
    }
  }

  const handleOnInput = (e: string) => {
    enforcer(e.replace(/,/g, '.'))
  }

  return (
    <StyledInput
      textAlign={textAlign}
      inputMode="decimal"
      placeholder="0.0"
      pattern="^[0-9]*[.,]?[0-9]*$"
      value={value}
      minLength={1}
      maxLength={maxLength}
      onInput={(e) => handleOnInput(e.currentTarget.value)}
    />
  )
}
