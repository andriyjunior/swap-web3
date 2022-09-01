import {
  Typography,
  Flex,
  IconButton,
  Button,
  InnerContainer,
  Modal,
  ConfirmSupply,
} from 'components'
import { FC, RefObject, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TokenInput } from '../TokenInput'

import icon_plus from 'assets/icons/plus.svg'
import { TokenDTO } from 'types'

import allTokens from 'const/token-list.json'
import { useLiquidityForm } from './hooks'
import { useModalRef } from 'hooks'

const StyledPlusIcon = styled.img`
  margin: 10px 0;
`

const StyledPricesAndPool = styled(Flex)`
  padding-bottom: 20px;
`
const StyledSupplyWrapper = styled.div`
  margin-top: 16px;
`

//TODO: after moving a liquidity state to global state assign properly types in interface

interface IAddLiquidity {
  settingsRef: RefObject<any>
}

export const AddLiquidity: FC<IAddLiquidity> = ({ settingsRef }) => {
  const [liquidityFormShown, setLiquidityFormShown] = useState(false)

  const { t } = useTranslation()
  const { state, handleOnChange } = useLiquidityForm()

  const confirmSupplyRef = useModalRef()

  const getTokenList = useMemo((): TokenDTO[] => {
    return allTokens.tokens.filter(
      (item) =>
        item?.address !== state.inputToken.address &&
        item?.address !== state.outputToken.address
    )
  }, [state])

  return (
    <>
      <Typography.Header4>{t('liquidityForm.addLiquidity')}</Typography.Header4>

      <Modal title={t('confirmSupply.youWillRecieve')} ref={confirmSupplyRef}>
        <ConfirmSupply />
      </Modal>

      <Flex alignItems="center" justifyContent="space-between">
        <Typography.Title>
          {t('liquidityForm.addLiquidityToReceiveLpTokens')}
        </Typography.Title>

        <IconButton
          icon="settings"
          onClick={() => settingsRef.current?.open()}
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
            <Button
              title={t('supply')}
              onClick={() => confirmSupplyRef.current?.open()}
            />
          </StyledSupplyWrapper>
        </>
      )}
    </>
  )
}
