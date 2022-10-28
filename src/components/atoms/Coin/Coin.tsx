import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import QUESTION_MARK_icon from 'assets/coins/QUESTION_MARK.png'

interface ICoinProps {
  src: string
  width?: 'small' | 'middle' | 'large'
}

const StyledCoin = styled.img<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`

export const Coin: FC<ICoinProps> = ({ src, width = 'small' }) => {
  const [isError, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [src])

  const sizes = {
    ['small']: 24,
    ['middle']: 36,
    ['large']: 48,
  }

  const size = sizes[width]

  return (
    <StyledCoin
      onError={() => setError(true)}
      src={isError ? QUESTION_MARK_icon : src}
      size={size}
    />
  )
}
