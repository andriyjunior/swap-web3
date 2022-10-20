import { FC, ReactNode, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { borderRadius, colors, getTransparentColor } from 'styles'

import icon_success from 'assets/icons/success.svg'
import icon_cross from 'assets/icons/cross.svg'
import { Typography } from '../Typography'
import { IToastProps } from './types'
import { motion } from 'framer-motion'

const toastsColor = {
  success: colors.success,
  danger: colors.error,
  warning: colors.warning,
  info: colors.white,
}

const StyledWrapper = styled(motion.div)``

const StyledRoot = styled.div`
  position: relative;
  margin-bottom: 4px;
  width: 318px;
  height: 0px;
  min-height: 64px;
  border: 2px solid ${colors.white};
  background-color: ${colors.white};
  border-radius: ${borderRadius.primary};
  overflow: hidden;
  display: flex;
  align-items: center;
`

const StyledLeft = styled.div<{ color: string }>`
  width: 40px;
  height: 100%;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledIcon = styled.img`
  width: 24px;
  height: 24px;
`

const StyledBody = styled.div`
  padding-left: 10px;
`

const StyledTitle = styled(Typography.Title)`
  padding: 0;
`

const StyledCross = styled.button`
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 5px;
  right: 5px;
  transition: opacity 0.1s ease-in;

  &:hover {
    opacity: 0.5;
  }
`

export const Toast: FC<IToastProps> = ({ toast, onRemove, style, ttl }) => {
  const timer = useRef<NodeJS.Timeout | undefined | number>()
  const { id, title, description, type } = toast

  const handleRemove = useCallback(() => {
    onRemove(id)
  }, [onRemove])

  const handleMouseEnter = () => {
    clearTimeout(timer.current)
  }

  const handleMouseLeave = () => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      handleRemove()
    }, ttl)
  }

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      handleRemove()
    }, ttl)

    return () => {
      clearTimeout(timer.current)
    }
  }, [timer, ttl, handleRemove])

  return (
    <StyledWrapper
      style={style}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <StyledRoot
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <StyledLeft color={toastsColor[type]}>
          <StyledIcon src={icon_success} />
        </StyledLeft>
        <StyledBody>
          <StyledTitle>{title}</StyledTitle>
          {description}
        </StyledBody>
        <StyledCross onClick={handleRemove}>
          <img src={icon_cross} />
        </StyledCross>
      </StyledRoot>
    </StyledWrapper>
  )
}
