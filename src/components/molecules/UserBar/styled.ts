import { motion } from 'framer-motion'
import styled from 'styled-components'
import { colors } from 'styles'

export const StyledRoot = styled.div<{ isOpened: boolean }>`
  position: relative;
  padding: 12px 16px;
  width: ${({ isOpened }) => (isOpened ? '164px' : '132px')};
  background-color: ${colors.white};
  border: none;
  border-radius: ${({ isOpened }) => (isOpened ? '22px 22px 0 0' : '22px')};
  text-align: left;
  transition-property: width border-radius;
  transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
  cursor: pointer;
`
export const StyledAvatarWrap = styled.div`
  content: '';
  position: absolute;
  right: -9px;
  top: -2px;
  width: 48px;
  height: 48px;
  background: ${colors.white};
  border: 2px solid ${colors.cyan};
  border-radius: 50%;
  z-index: 1;
`

export const StyledProfileButtons = styled(motion.div)`
  position: absolute;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  left: 0;
  top: 100%;
  background-color: ${colors.white};
  border-radius: 0 0 22px 22px;
  overflow: hidden;
`
