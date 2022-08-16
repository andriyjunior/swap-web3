import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { colors, gradients } from 'styles'

export const styledButton = css`
  position: relative;
  display: block;
  padding: 0 18px;
  margin-bottom: 4px;
  height: 42px;
  width: 100%;
  text-align: left;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: background-color 0.1s ease-in;

  &.active {
    background-color: ${colors.white};
  }

  &::before {
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-image-slice: 1;
    border-image-source: ${gradients.primary};
    border-width: 1px;
    border-radius: 10px;
    border-style: solid;
    background: ${gradients.primary} border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.1s ease-in;
  }

  &:hover::before {
    opacity: 1;
  }
`

export const StyledButtonLink = styled(NavLink)`
  ${styledButton}
`

export const StyledButton = styled.button`
  ${styledButton}
`

export const StyledTitle = styled.span`
  padding-left: 8px;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.black};
`
export const StyledIcon = styled.img`
  width: 24px;
  height: 24px;
`
