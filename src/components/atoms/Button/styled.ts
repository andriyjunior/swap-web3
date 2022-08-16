import styled from 'styled-components'
import { colors, gradients } from 'styles'

export const StyledRoot = styled.button`
  margin-right: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
  border: none;
  border-radius: 42px;
  outline: 2px solid ${colors.white};
  padding: 0 40px;
  height: 40px;
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
    border-image-source: ${gradients.primary};
    border-width: 2px;
    border-radius: 42px;
    border-style: solid;
    background: ${gradients.primary} border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
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
    background: ${gradients.primary};
    border-radius: 42px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.1s ease-in;
  }

  &:hover::before {
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    border-width: 4px;
  }

  &:active {
    span {
      font-weight: 700;
      color: ${colors.white};
    }

    &::after {
      opacity: 1;
    }
  }
`

export const StyledTitle = styled.span`
  font-weight: 400;
  color: ${colors.black};
  font-size: 16;
  transition-property: font-weight color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in;
`
