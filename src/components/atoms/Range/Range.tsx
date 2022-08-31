import { FC } from 'react'
import styled from 'styled-components'
import { colors, getTransparentColor, gradients, shadows } from 'styles'

interface IRange {
  value: number
  onChange: (value: number) => void
  name: string
  step?: number
}

const StyledRoot = styled.div`
  position: relative;
  margin: 16px 32px;
`

const StyledInput = styled.input<{ width: number }>`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  appearance: none;
  max-width: 700px;
  width: 100%;
  height: 10px;
  cursor: pointer;
  background: ${gradients.white};
  box-shadow: ${shadows.inner};
  border-radius: 10px;
  border: 1px solid ${getTransparentColor(colors.black, 0.05)};

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    height: 10px;
    background-color: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none;
    height: 20px;
    width: 20px;
    background: ${colors.white};
    border-radius: 100%;
    border: 1px solid ${getTransparentColor(colors.black, 0.05)};
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${shadows.logo};
    transition: background-color 150ms;
  }

  &::before {
    position: absolute;
    content: '';
    width: ${({ width }) => width + '%'};
    height: 10px;
    background: ${gradients.primary};
  }
`

export const Range: FC<IRange> = ({ value, onChange, name, step = 1 }) => {
  return (
    <StyledRoot>
      <StyledInput
        name={name}
        width={value}
        value={value}
        type="range"
        step={step}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    </StyledRoot>
  )
}
