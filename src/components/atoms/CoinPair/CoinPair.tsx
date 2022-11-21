import { FC, useState } from 'react'
import styled from 'styled-components'
import { colors } from 'styles'

import QUESTION_MARK_icon from 'assets/coins/QUESTION_MARK.png'

interface ICoinPairProps {
  inputToken: string
  outputToken: string
  size?: 'large' | 'small'
}

const StyledRoot = styled.div<{ width: number }>`
  position: relative;
  display: flex;
  width: ${({ width }) => width}px;
`

const StyledIcon = styled.img<{ size: number; borderSize: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: ${({ borderSize }) => borderSize}px solid ${colors.white};
  border-radius: 50%;
  background-color: ${colors.white};
`

const StyledSecondCoin = styled(StyledIcon)`
  position: absolute;
  left: 0;
  transform: translateX(50%);
`

export const CoinPair: FC<ICoinPairProps> = ({
  inputToken,
  outputToken,
  size = 'small',
}) => {
  const [img0Err, setImg0Err] = useState(false)
  const [img1Err, setImg1Err] = useState(false)

  const isLarge = size === 'large'

  const containerSize = isLarge ? 70 : 24
  const sizePX = isLarge ? 48 : 24
  const borderSize = isLarge ? 3 : 2

  return (
    <StyledRoot width={containerSize}>
      <StyledIcon
        onError={() => setImg0Err(true)}
        size={sizePX}
        borderSize={borderSize}
        src={img0Err ? QUESTION_MARK_icon : inputToken}
      />
      <StyledSecondCoin
        size={sizePX}
        borderSize={borderSize}
        onError={() => setImg1Err(true)}
        src={img1Err ? QUESTION_MARK_icon : outputToken}
      />
    </StyledRoot>
  )
}
