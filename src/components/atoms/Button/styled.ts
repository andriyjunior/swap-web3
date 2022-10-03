import styled from 'styled-components'
import {
  borderRadius,
  colorConverter,
  colors,
  getTransparentColor,
  gradients,
} from 'styles'

export const StyledRoot = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
  border: none;
  border-radius: ${borderRadius.primary};
  outline: 2px solid ${colors.white};
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
    background: ${gradients.secondary};
    border-radius: ${borderRadius.primary};
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

  &:disabled {
    &::before {
      background: transparent;
      border-image-source: none;
      -webkit-mask: none;
    }

    &:hover::before {
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border-width: 2px;
      cursor: not-allowed;
    }

    &:active {
      span {
        font-weight: 400;
        /* color: ${colors.white}; */
      }

      &::after {
        opacity: 0;
      }
    }

    span {
      color: ${getTransparentColor(colors.black, 0.2)};
    }
  }
`

export const StyledTitle = styled.span`
  font-weight: 400;
  color: ${colors.black};
  font-size: 16px;
  transition-property: font-weight color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in;
`

export const StyledIcon = styled.img`
  margin-right: 10px;
`
