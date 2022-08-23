import { FC } from 'react'
import styled from 'styled-components'
import { getTransparentColor, colors, borderRadius, shadows } from 'styles'
import { escapeRegExp } from 'utils'
import { inputRegex } from '../utils'

interface INumberInputProps {
  value: string
  onInput: (e: string) => void
  placeholder: string
  error?: boolean
}

const StyledInput = styled.input`
  background-color: none;
  border: none;
  height: 42px;
  text-align: center;
  padding: 0 10px;
  box-shadow: ${shadows.inner};
  background-color: ${colors.white};
  border: 1px solid ${getTransparentColor(colors.black, 0.05)};
  border-radius: ${borderRadius.primary};
  font-weight: 500;
  font-size: 14px;

  &.error {
    border-color: ${colors.error};
    color: ${colors.error};
  }

  &:focus {
    outline: none;
  }

  &::placeholder {
    font-size: 14px;
    color: ${getTransparentColor(colors.black, 0.5)};
    font-weight: 500;
  }
`

export const NumberInput: FC<INumberInputProps> = ({
  value,
  onInput,
  placeholder,
  error,
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
      className={error ? 'error' : ''}
      placeholder={placeholder}
      inputMode="decimal"
      pattern="^[0-9]*[.,]?[0-9]*$"
      value={value}
      minLength={1}
      maxLength={3}
      onInput={(e) => handleOnInput(e.currentTarget.value)}
    />
  )
}
