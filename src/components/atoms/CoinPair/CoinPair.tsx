import { FC } from 'react'
import styled from 'styled-components'
import { colors } from 'styles'

interface ICoinPairProps {
  inputToken: string
  outputToken: string
}

const StyledRoot = styled.div`
  position: relative;
`

const StyledIcon = styled.img`
  width: 24px;
  height: 24px;
  border: 2px solid ${colors.white};
  border-radius: 50%;
  background-color: ${colors.white};
`

const StyledSecondCoin = styled(StyledIcon)`
  position: absolute;
  left: 0;
  transform: translateX(50%);
`

export const CoinPair: FC<ICoinPairProps> = ({ inputToken, outputToken }) => {
  return (
    <StyledRoot>
      <StyledIcon src={inputToken} />
      <StyledSecondCoin src={outputToken} />
    </StyledRoot>
  )
}
