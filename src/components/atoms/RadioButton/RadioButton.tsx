import { FC } from 'react'
import styled from 'styled-components'
import { borderRadius, colors, gradients } from 'styles'
import { Typography } from '../Typography'

interface IRadioButtonProps {
  name: string
  value: string | number
  checked: boolean
  onChange: (value: { [x: string]: string | number }) => void
  title: string
  defaultChecked?: boolean
}

const StyledItem = styled.div`
  position: relative;
  width: 100%;

  &:not(:last-child) {
    margin-right: 10px;
  }
`

const StyledButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
  border: none;
  border-radius: ${borderRadius.primary};
  height: 42px;
  width: 100%;
  z-index: 0;

  &::before {
    position: absolute;
    content: '';
    left: 0px;
    top: 0px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    border-image-slice: 1;
    border-image-source: ${gradients.secondary};
    border-width: 2px;
    border-radius: ${borderRadius.primary};
    border-style: solid;
    background: ${gradients.secondary} border-box;
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    transition-property: width height;
    transition-duration: 0.1s;
    transition-timing-function: ease-in;
    z-index: 1;
  }

  &::after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${gradients.secondary};
    border-radius: ${borderRadius.primary};
    z-index: -1;
    opacity: 0;
    transition: opacity 0.1s ease-in;
  }
`

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  opacity: 0;
  cursor: pointer;

  &:hover ~ ${StyledButton} {
    &::before {
      width: calc(100% - 8px);
      height: calc(100% - 8px);
      border-width: 4px;
    }
  }

  &:checked ~ ${StyledButton} {
    span {
      font-weight: 700;
      color: ${colors.white};
    }

    &::after {
      opacity: 1;
    }
  }
`

export const RadioButton: FC<IRadioButtonProps> = ({
  title,
  name,
  value,
  onChange,
  checked,
  defaultChecked,
}) => {
  return (
    <StyledItem>
      <StyledInput
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => {
          onChange({ [name]: e.target.value })
        }}
        defaultChecked={defaultChecked}
      />
      <StyledButton>
        <Typography.Button>{title}</Typography.Button>
      </StyledButton>
    </StyledItem>
  )
}
