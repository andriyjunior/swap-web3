import { FC, memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Typography,
  Flex,
  BigDecimalInput,
  Range,
  RadioButton,
  Button,
  TokenSelector,
  Modal,
  TransactionSubmited,
} from 'components'

import {
  StyledArrowButton,
  StyledArrowIcon,
  StyledContainer,
  StyledHeaderContainer,
  StyledAmount,
  StyledDetailed,
  StyledRadioContainer,
  StyledTokenLiquidityAmount,
  StyledPriceContainer,
  StyledTokenPrice,
} from './styled'
import styled from 'styled-components'
import { useModalRef } from 'hooks'
import { Field } from 'store'
import { ConfirmRemoveLiquidity } from '../ConfirmRemoveLiquidity'
import { useRemoveLiquidity } from './hooks'

import icon_arrow from 'assets/icons/back-arrow.svg'

const StyledSupplyWrapper = styled.div`
  display: flex;
  gap: 20px;
`

const data2 = {
  name: 'percentOfAmount',
  options: [
    {
      value: 25,
      key: '25%',
    },
    {
      value: 50,
      key: '50%',
    },
    {
      value: 75,
      key: '75%',
    },
    {
      value: 100,
      key: 'Max',
    },
  ],
}

const allAmount = 1000

interface IRemoveLiquidity {
  onGoBack: () => void
  userCurrencyA?: string
  userCurrencyB?: string
}

export const RemoveLiquidity: FC<IRemoveLiquidity> = memo(
  ({ onGoBack, userCurrencyA, userCurrencyB }) => {
    const confirmModalRef = useModalRef()
    const txSubmitedRef = useModalRef()

    const { t } = useTranslation()

    const {
      onRemove,
      currencyA,
      currencyB,
      parsedAmounts,
      formattedAmounts,
      txHash,
      _onUserInput,
      pair,
      tokenA,
      tokenB,
      onAttempToApprove,
      onLiquidityInput,
    } = useRemoveLiquidity(userCurrencyA, userCurrencyB)

    useEffect(() => {
      if (txHash) {
        txSubmitedRef.current?.open()
      }
    }, [txHash])

    const isDisabled = Boolean(!currencyA || !currencyB)
    const isDisabledRemove = isDisabled || !parsedAmounts.LIQUIDITY

    const handleOnRemove = () => {
      onRemove()
      confirmModalRef?.current?.close()
    }

    return (
      <>
        <Modal ref={confirmModalRef}>
          <ConfirmRemoveLiquidity
            currencies={{
              [Field.CURRENCY_A]: currencyA,
              [Field.CURRENCY_B]: currencyB,
            }}
            amounts={formattedAmounts}
            onSupply={handleOnRemove}
            liquidityMinted={parsedAmounts[Field.LIQUIDITY]}
          />
        </Modal>

        <Modal
          title={t('transactionSubmited.transactionSubmited')}
          ref={txSubmitedRef}
        >
          <TransactionSubmited
            onClose={() => txSubmitedRef.current?.close()}
            txHash={txHash}
          />
        </Modal>

        <Flex alignItems="center">
          <StyledArrowButton onClick={onGoBack}>
            <StyledArrowIcon src={icon_arrow} />
          </StyledArrowButton>
          <Typography.Header4>
            {t('liquidityForm.removeLiquidity')}
          </Typography.Header4>
        </Flex>
        <StyledContainer>
          <StyledHeaderContainer justifyContent="space-between">
            <StyledAmount>{t('amount')}</StyledAmount>
            <StyledDetailed to={'#'}>{t('detailed')}</StyledDetailed>
          </StyledHeaderContainer>
          <BigDecimalInput
            value={formattedAmounts[Field.LIQUIDITY]}
            onInput={(value) => {
              if (Number(value) <= allAmount) {
                onLiquidityInput(value)
              }
            }}
            textAlign="left"
          />
          <Range
            // step={10}
            onChange={(value) =>
              _onUserInput(Field.LIQUIDITY_PERCENT, String(value))
            }
            value={Number(formattedAmounts[Field.LIQUIDITY_PERCENT])}
            name={'amount'}
          />

          <StyledRadioContainer>
            {data2.options.map((item) => {
              return (
                <RadioButton
                  checked={
                    Number(item.value) ===
                    Number(formattedAmounts[Field.LIQUIDITY_PERCENT])
                  }
                  key={item.key}
                  title={t(item.key)}
                  name={data2.name}
                  value={item.value}
                  onChange={(value) =>
                    _onUserInput(
                      Field.LIQUIDITY_PERCENT,
                      String(value[data2.name])
                    )
                  }
                />
              )
            })}
          </StyledRadioContainer>
        </StyledContainer>
        <StyledContainer>
          <Flex flexDirection="column">
            <Flex justifyContent="space-between" alignItems="center">
              <StyledTokenLiquidityAmount>
                {formattedAmounts[Field.CURRENCY_A] || '0.0'}
              </StyledTokenLiquidityAmount>
              <TokenSelector title={currencyA?.symbol ?? ''} />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <StyledTokenLiquidityAmount>
                {formattedAmounts[Field.CURRENCY_B] || '0.0'}
              </StyledTokenLiquidityAmount>
              <TokenSelector title={currencyB?.symbol ?? ''} />
            </Flex>
          </Flex>
        </StyledContainer>

        {pair && (
          <StyledPriceContainer justifyContent="space-between">
            <StyledTokenPrice>{t('price')}:</StyledTokenPrice>
            <Flex flexDirection="column" alignItems="flex-end">
              {tokenA && (
                <StyledTokenPrice>
                  1 {currencyA?.symbol} ={' '}
                  {pair.priceOf(tokenA).toSignificant(6)} {currencyB?.symbol}
                </StyledTokenPrice>
              )}
              {tokenB && (
                <StyledTokenPrice>
                  1 {currencyB?.symbol} ={' '}
                  {pair.priceOf(tokenB).toSignificant(6)} {currencyA?.symbol}
                </StyledTokenPrice>
              )}
            </Flex>
          </StyledPriceContainer>
        )}

        <StyledSupplyWrapper>
          <Button
            isDisabled={isDisabled}
            title={t('Enable')}
            onClick={onAttempToApprove}
          />
          <Button
            isDisabled={isDisabledRemove}
            title={t('remove')}
            onClick={() => confirmModalRef.current?.open()}
          />
        </StyledSupplyWrapper>
      </>
    )
  }
)
