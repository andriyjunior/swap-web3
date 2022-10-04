import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { getTransparentColor, colors } from 'styles'

export const StyledRoot = styled(NavLink)<{ isActive: boolean }>`
  position: relative;
  background: ${({ isActive }) =>
    isActive ? colors.white : getTransparentColor(colors.black, 0.05)};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;
  border: none;
  transition: background 0.2s ease-in;

  &:focus {
    outline: none;
  }

  &:first-child {
    border-radius: 8px 0px 0px 0px;
  }
  &:last-child {
    border-radius: 0px 8px 0px 0px;
  }

  &::after,
  &::before {
    transition: opacity 0.2s ease-in;
  }

  &::after {
    position: absolute;
    content: '';
    top: 0;
    left: 100%;
    width: 20px;
    height: 100%;
    background-color: ${colors.white};
    clip-path: polygon(0 0, 0 100%, 100% 100%);
    z-index: 1;
    opacity: 0;
  }

  &:first-child::after {
    opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  }

  &::before {
    position: absolute;
    content: '';
    top: 0;
    right: 100%;
    width: 20px;
    height: 100%;
    background-color: ${colors.white};
    clip-path: polygon(100% 0, 0% 100%, 100% 100%);
    z-index: 1;
    opacity: 0;
  }

  &:last-child::before {
    opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  }
`

export const StyledText = styled.span`
  font-weight: 500;
  color: ${getTransparentColor(colors.black, 0.5)}; ;
`
