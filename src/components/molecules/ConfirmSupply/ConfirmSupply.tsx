import {
  Typography,
  Flex,
  CoinPair,
  HorizontalSeparator,
  Button,
} from 'components'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'

import bnb from 'assets/coins/BNB.png'

const StyledButton = styled.div`
  padding: 24px 0 16px;
`

const StyledTextRow = styled(Flex)`
  padding-top: 24px;
  padding-right: 18px;
`

const StyledText = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledCoin = styled.img`
  margin-left: 10px;
  width: 24px;
  height: 24px;
`

const state = {
  inputToken: 'BNB',
  outputToken: 'USDT',
}

export const ConfirmSupply = () => {
  const { t } = useTranslation()

  return (
    <>
      <Flex>
        <Typography.Header3>0.0576295</Typography.Header3>
        <CoinPair size="large" inputToken={bnb} outputToken={bnb} />
      </Flex>
      <Typography.Title>
        {state.inputToken}/{state.outputToken}&nbsp;
        {t('confirmSupply.poolTokens')}
      </Typography.Title>
      <StyledText>
        {t('confirmSupply.outputIsEstimated', { percent: 0.08 })}
      </StyledText>
      <HorizontalSeparator />

      <StyledTextRow alignItems="center" justifyContent="space-between">
        <StyledText>
          {state.inputToken}&nbsp; {t('deposited')}:
        </StyledText>
        <Flex alignItems="center">
          <StyledText>100.25</StyledText>
          <StyledCoin src={bnb} />
        </Flex>
      </StyledTextRow>

      <StyledTextRow alignItems="center" justifyContent="space-between">
        <StyledText>
          {state.outputToken}&nbsp; {t('deposited')}:
        </StyledText>
        <Flex alignItems="center">
          <StyledText>100.25</StyledText>
          <StyledCoin src={bnb} />
        </Flex>
      </StyledTextRow>

      <StyledTextRow alignItems="flex-start" justifyContent="space-between">
        <StyledText>{t('rates')}:</StyledText>
        <Flex alignItems="flex-end" flexDirection="column">
          <StyledText>1 {state.inputToken} = 0.0352 AXIE</StyledText>
          <StyledText>1 {state.outputToken} = 0.0352 AXIE</StyledText>
        </Flex>
      </StyledTextRow>

      <StyledTextRow alignItems="center" justifyContent="space-between">
        <StyledText>{t('confirmSupply.shareOfPool')}:</StyledText>
        <StyledText>100.25</StyledText>
      </StyledTextRow>

      <StyledButton>
        <Button title={t('confirmSupply.confirmSupply')} onClick={() => {}} />
      </StyledButton>
    </>
  )
}
