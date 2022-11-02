import { ChangeEventHandler, FC, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { getTransparentColor, colors, borderRadius, shadows } from 'styles'
import { escapeRegExp } from 'utils'
import { inputRegex } from '../utils'

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

interface INumberInputProps {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  placeholder: string
  error?: boolean
  pattern?: string
  inputMode?: string
  onBlur?: () => void
}

export const NumberInput: FC<INumberInputProps> = ({
  value,
  placeholder,
  error,
  onChange,
  pattern = '^[0-9]*[.,]?[0-9]{0,2}$',
  inputMode = 'decimal',
  onBlur,
}) => {
  // const enforcer = (nextUserInput: string) => {
  //   if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
  //     onInput(nextUserInput)
  //   }
  // }

  // const handleOnInput = (e: string) => {
  //   enforcer(e.replace(/,/g, '.'))
  // }

  return (
    <StyledInput
      className={error ? 'error' : ''}
      placeholder={placeholder}
      inputMode="decimal"
      pattern={pattern}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}
