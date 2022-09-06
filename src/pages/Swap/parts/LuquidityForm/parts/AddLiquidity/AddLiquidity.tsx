import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useModalRef } from 'hooks'
import { TokenDTO } from 'types'
import { useLiquidityForm } from './hooks'
import {
  Typography,
  Flex,
  IconButton,
  Button,
  InnerContainer,
  Modal,
  TransactionSubmited,
  TokenInput,
} from 'components'

import icon_plus from 'assets/icons/plus.svg'
import allTokens from 'const/token-list.json'
import { ConfirmSupply } from '../ConfirmSupply'

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
  onOpenSettings: () => void
}

export const AddLiquidity: FC<IAddLiquidity> = ({ onOpenSettings }) => {
  const [liquidityFormShown, setLiquidityFormShown] = useState(false)

  const { t } = useTranslation()
  const { state, handleOnChange } = useLiquidityForm()

  const confirmSupplyRef = useModalRef()
  const txSubmitedRef = useModalRef()

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
        <ConfirmSupply
          onSuccess={() => {
            confirmSupplyRef.current?.close()
            txSubmitedRef.current?.open()
          }}
        />
      </Modal>

      <Modal
        title={t('transactionSubmited.transactionSubmited')}
        ref={txSubmitedRef}
      >
        <TransactionSubmited onClose={() => txSubmitedRef.current?.close()} />
      </Modal>

      <Flex alignItems="center" justifyContent="space-between">
        <Typography.Title>
          {t('liquidityForm.addLiquidityToReceiveLpTokens')}
        </Typography.Title>

        <IconButton icon="settings" onClick={onOpenSettings} />
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
