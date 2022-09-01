import { FC } from 'react'
import styled from 'styled-components'
import { colors } from 'styles'

interface ICoinPairProps {
  inputToken: string
  outputToken: string
  size?: 'large' | 'small'
}

const StyledRoot = styled.div`
  position: relative;
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
  const sizePX = size === 'large' ? 48 : 24
  const borderSize = size === 'large' ? 3 : 2

  return (
    <StyledRoot>
      <StyledIcon size={sizePX} borderSize={borderSize} src={inputToken} />
      <StyledSecondCoin
        size={sizePX}
        borderSize={borderSize}
        src={outputToken}
      />
    </StyledRoot>
  )
}
