import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Accordion, Button, CoinPair, Flex, Typography } from 'components'

import { colors, getTransparentColor } from 'styles'

import icon_BNB from 'assets/coins/BNB.png'
import icon_USDT from 'assets/coins/Tether.png'
import { useNavigate } from 'react-router-dom'
import { paths } from 'const'

const StyledPairTitle = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledButtons = styled(Flex)`
  padding-top: 10px;
  gap: 10px;
`

const StyledTextRow = styled(Flex)`
  margin-top: 10px;
  height: 24px;
`

const StyledText = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledCoinWrapper = styled.span`
  padding-left: 10px;
`

const StyledCoinIcon = styled.img`
  width: 24px;
  height: 24px;
`

const state = {
  inputToken: {
    logoURI: icon_USDT,
    symbol: 'USDT',
  },

  outputToken: {
    logoURI: icon_BNB,
    symbol: 'BNB',
  },
}

interface ILiquidityPool {
  onRemove: () => void
}

export const LiquidityPool: FC<ILiquidityPool> = ({ onRemove }) => {
  const navigate = useNavigate()

  const { t } = useTranslation()

  const handleOnRemove = () => {
    navigate(paths.removeLiquidity())
  }

  return (
    <>
      <Typography.Title>{t('liquidityForm.yourLiquidity')}</Typography.Title>
      <Accordion
        hasArrow
        element={
          <Flex alignItems="center">
            <CoinPair
              inputToken={state.inputToken.logoURI}
              outputToken={state.outputToken.logoURI}
            />
            <StyledPairTitle>
              {state.inputToken.symbol}/{state.outputToken.symbol}
            </StyledPairTitle>
          </Flex>
        }
      >
        <StyledTextRow justifyContent="space-between" alignItems="center">
          <StyledText>
            {t('liquidityForm.pooled')}&nbsp;
            {state.inputToken.symbol}:
          </StyledText>
          <Flex justifyContent="space-between" alignItems="center">
            <StyledText>100.25</StyledText>
            <StyledCoinWrapper>
              <StyledCoinIcon src={state.inputToken.logoURI} />
            </StyledCoinWrapper>
          </Flex>
        </StyledTextRow>

        <StyledTextRow justifyContent="space-between" alignItems="center">
          <StyledText>
            {t('liquidityForm.pooled')}&nbsp;
            {state.outputToken.symbol}:
          </StyledText>
          <Flex justifyContent="space-between" alignItems="center">
            <StyledText>100.25</StyledText>
            <StyledCoinWrapper>
              <StyledCoinIcon src={state.outputToken.logoURI} />
            </StyledCoinWrapper>
          </Flex>
        </StyledTextRow>

        <StyledTextRow justifyContent="space-between" alignItems="center">
          <StyledText>{t('liquidityForm.yourPoolTokens')}</StyledText>
          <StyledText>0.006</StyledText>
        </StyledTextRow>
        <StyledTextRow justifyContent="space-between" alignItems="center">
          <StyledText>{t('liquidityForm.yourPoolShare')}</StyledText>
          <StyledText>0.01%</StyledText>
        </StyledTextRow>

        <StyledButtons>
          <Button title={t('add')} onClick={() => {}} />
          <Button title={t('remove')} onClick={handleOnRemove} />
        </StyledButtons>
      </Accordion>
    </>
  )
}
