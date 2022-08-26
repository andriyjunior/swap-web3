import { FC, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Typography,
  IconButton,
  Button,
  Modal,
  TModal,
  Settings,
  TokenInput,
  InnerContainer,
  Accordion,
  CoinPair,
} from 'components'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { useLiquidityForm } from './hooks'
import { TokenDTO } from 'types'
import { colors, getTransparentColor } from 'styles'

import allTokens from 'const/token-list.json'
import icon_plus from 'assets/icons/plus.svg'

const StyledPlusIcon = styled.img`
  margin: 10px 0;
`

const StyledPricesAndPool = styled(Flex)`
  padding-bottom: 20px;
`

const StyledPairTitle = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledSupplyWrapper = styled.div`
  margin-top: 16px;
`

// interface ISwapProps {}

export const LuquidityForm: FC = () => {
  const { t } = useTranslation()
  const [liquidityFormShown, setLiquidityFormShown] = useState(false)

  const settingsModalRef = useRef<TModal>(null)

  const { state, handleOnChange } = useLiquidityForm()

  const getTokenList = useMemo((): TokenDTO[] => {
    return allTokens.tokens.filter(
      (item) =>
        item?.address !== state.inputToken.address &&
        item?.address !== state.outputToken.address
    )
  }, [state])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Modal ref={settingsModalRef} title={t('settings')}>
          <Settings />
        </Modal>

        <Typography.Header4>
          {t('liquidityForm.addLiquidity')}
        </Typography.Header4>

        <Flex alignItems="center" justifyContent="space-between">
          <Typography.Title>
            {t('liquidityForm.addLiquidityToReceiveLpTokens')}
          </Typography.Title>

          <IconButton
            icon="settings"
            onClick={() => settingsModalRef.current?.open()}
          />
        </Flex>

        {!liquidityFormShown && (
          <Button
            title={t('liquidityForm.addLiquidity')}
            onClick={() => setLiquidityFormShown(true)}
          />
        )}

        {liquidityFormShown && (
          <>
            <TokenInput
              tokenName={state.inputToken.symbol}
              icon={state.inputToken.logoURI}
              amount={state.inputAmount}
              onInput={(value) => handleOnChange({ inputAmount: value })}
              onSelectToken={(value) =>
                handleOnChange({
                  inputToken: value,
                })
              }
              tokenList={getTokenList}
            />
            <Flex justifyContent="center" alignItems="center">
              <StyledPlusIcon src={icon_plus} />
            </Flex>
            <TokenInput
              tokenName={state.outputToken.symbol}
              icon={state.outputToken.logoURI}
              amount={state.outputAmount}
              onInput={(value) => handleOnChange({ outputAmount: value })}
              onSelectToken={(value) =>
                handleOnChange({
                  outputToken: value,
                })
              }
              tokenList={getTokenList}
            />
            <Typography.Title>
              {t('liquidityForm.pricesAndPoolShare')}
            </Typography.Title>
            <InnerContainer>
              <StyledPricesAndPool
                justifyContent="space-between"
                alignItems="center"
              >
                <Flex alignItems="center" flexDirection="column">
                  <Typography.Title>432.794</Typography.Title>
                  <Typography.Body>
                    {state.inputToken.symbol} per {state.outputToken.symbol}
                  </Typography.Body>
                </Flex>
                <Flex alignItems="center" flexDirection="column">
                  <Typography.Title>0.00231057</Typography.Title>
                  <Typography.Body>
                    {state.inputToken.symbol} per {state.outputToken.symbol}
                  </Typography.Body>
                </Flex>
                <Flex alignItems="center" flexDirection="column">
                  <Typography.Title>0%</Typography.Title>
                  <Typography.Body>Share of Pool</Typography.Body>
                </Flex>
              </StyledPricesAndPool>
            </InnerContainer>
            <StyledSupplyWrapper>
              <Button title={t('supply')} onClick={() => {}} />
            </StyledSupplyWrapper>
          </>
        )}

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
          Content
        </Accordion>
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
          Content
        </Accordion>
      </motion.div>
    </AnimatePresence>
  )
}
