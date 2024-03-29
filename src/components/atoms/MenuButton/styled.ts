import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { borderRadius, breakpoints, colors, gradients, shadows } from 'styles'

export const styledButton = css`
  position: relative;
  display: block;
  padding: 0 18px;
  margin-bottom: 8px;
  height: 42px;
  width: 100%;
  text-align: left;
  background-color: transparent;
  border: none;
  border-radius: ${borderRadius.primary};
  display: flex;
  align-items: center;
  transition: background-color 0.1s ease-in;

  @media (max-width: ${breakpoints.md}) {
    margin-bottom: 0;
    justify-content: center;
  }

  &.active {
    background-color: ${colors.white};
    box-shadow: ${shadows.main};
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

    @media (max-width: ${breakpoints.md}) {
      opacity: 0;
    }
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
  font-size: 16px;
  color: ${colors.black};
`

export const StyledIconWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledIcon = styled.img`
  width: 24px;
  height: 24px;
`

export const StyledSoon = styled.span`
  padding: 2px;
  position: absolute;
  font-size: 6px;
  width: 100%;
  bottom: 0;
  left: 0;
  text-align: center;
  text-transform: uppercase;
  color: ${colors.white};
  font-weight: 700;
  background-color: ${colors.black};
  border-radius: 26px;
`
