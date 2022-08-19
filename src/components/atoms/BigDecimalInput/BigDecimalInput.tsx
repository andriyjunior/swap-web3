import { FC } from 'react'
import styled from 'styled-components'
import { escapeRegExp } from 'utils'
import { inputRegex } from '../utils'

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

interface IBigDecimalInput {
  value: string
  onInput: (e: string) => void
}

export const BigDecimalInput: FC<IBigDecimalInput> = ({ value, onInput }) => {
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
      inputMode="decimal"
      placeholder="0.0"
      pattern="^[0-9]*[.,]?[0-9]*$"
      value={value}
      minLength={1}
      maxLength={79}
      onInput={(e) => handleOnInput(e.currentTarget.value)}
    />
  )
}
