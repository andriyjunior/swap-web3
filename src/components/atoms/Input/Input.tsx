import { FC } from 'react'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'
import { InnerContainer } from '../InnerContainer'

interface IInputProps {
  value: string
  onInput: (e: string) => void
  placeholder: string
}
const StyledRoot = styled(InnerContainer)``

const StyledInput = styled.input`
  width: 100%;
  height: 56px;
  background-color: transparent;
  border: none;

  &::placeholder {
    font-size: 14px;
    color: ${getTransparentColor(colors.black, 0.5)};
    font-weight: 500;
  }

  &:focus {
    outline: none;
  }
`

export const Input: FC<IInputProps> = ({ value, onInput, placeholder }) => {
  return (
    <StyledRoot>
      <StyledInput
        placeholder={placeholder}
        value={value}
        onInput={(e) => onInput(e.currentTarget.value)}
      />
    </StyledRoot>
  )
}
