import { AnimatePresence, motion } from 'framer-motion'
import { FC, ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components'
import { borderRadius, colors, shadows, zIndexes } from 'styles'
import { Typography } from '../Typography'

const StyledRoot = styled.div`
  position: relative;
  cursor: help;
`

const StyledTooltip = styled(motion.div)`
  min-width: 150px;
  position: absolute;
  left: 50%;
  bottom: 180%;
  filter: drop-shadow(0px 3px 12px rgba(118, 63, 209, 0.19));
`

const StyledTooltipInner = styled.div<{ isHover: boolean }>`
  transform: translateX(-50%);
  border-radius: ${borderRadius.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  position: relative;
  background-color: ${colors.white};

  &::before {
    position: absolute;
    bottom: -6px;
    content: '';
    width: 20px;
    height: 20px;
    background-color: ${colors.white};
    transform: rotate(45deg);
    border-radius: 4px;
    z-index: -10;
  }
`

const StyledText = styled(Typography.Body)`
  min-width: 150px;
  font-size: 14px;
  text-align: center;
`

interface ITooltipProps {
  children: ReactNode
  text: string
}

export const Tooltip: FC<ITooltipProps> = ({ children, text }) => {
  const [isHover, setHover] = useState(false)

  useEffect(() => {}, [])

  const handleMouseOver = () => setHover(true)
  const handleMouseLeave = () => {
    setHover(false)
  }

  return (
    <StyledRoot onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <AnimatePresence>
        {isHover && (
          <StyledTooltip
            initial={{ visibility: 'hidden', opacity: 0, y: 10 }}
            animate={{ visibility: 'visible', opacity: 1, y: 0 }}
          >
            <StyledTooltipInner isHover={isHover}>
              <StyledText>{text}</StyledText>
            </StyledTooltipInner>
          </StyledTooltip>
        )}
      </AnimatePresence>
      {children}
    </StyledRoot>
  )
}
