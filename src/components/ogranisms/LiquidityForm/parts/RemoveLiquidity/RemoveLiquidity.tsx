import { FC, memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Typography,
  Flex,
  BigDecimalInput,
  Range,
  RadioButton,
  Button,
  TokenSelector,
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

import icon_arrow from 'assets/icons/back-arrow.svg'
import { useWeb3React } from '@web3-react/core'
import { useCurrency, wrappedCurrency } from 'hooks'
import {
  Field,
  useBurnActionHandlers,
  useBurnState,
  useDerivedBurnInfo,
  useGasPrice,
} from 'store'
import { Percent } from 'packages/swap-sdk'

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
    const { chainId } = useWeb3React()

    const [currencyA, currencyB] = [
      useCurrency(userCurrencyA) ?? undefined,
      useCurrency(userCurrencyB) ?? undefined,
    ]

    const [tokenA, tokenB] = useMemo(
      () => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ],
      [currencyA, currencyB, chainId]
    )

    const gasPrice = useGasPrice()

    const { independentField, typedValue } = useBurnState()
    const [removalCheckedA, setRemovalCheckedA] = useState(true)
    const [removalCheckedB, setRemovalCheckedB] = useState(true)

    const { pair, parsedAmounts, error, tokenToReceive } = useDerivedBurnInfo(
      currencyA ?? undefined,
      currencyB ?? undefined,
      removalCheckedA,
      removalCheckedB
    )

    const { onUserInput: _onUserInput } = useBurnActionHandlers()

    const formattedAmounts = {
      [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo(
        '0'
      )
        ? '0'
        : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
      [Field.LIQUIDITY]:
        independentField === Field.LIQUIDITY
          ? typedValue
          : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
      [Field.CURRENCY_A]:
        independentField === Field.CURRENCY_A
          ? typedValue
          : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
      [Field.CURRENCY_B]:
        independentField === Field.CURRENCY_B
          ? typedValue
          : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    }

    // wrapped onUserInput to clear signatures
    const onUserInput = useCallback(
      (field: Field, value: string) => {
        // setSignatureData(null)
        return _onUserInput(field, value)
      },
      [_onUserInput]
    )

    const onLiquidityInput = useCallback(
      (value: string): void => onUserInput(Field.LIQUIDITY, value),
      [onUserInput]
    )

    const { t } = useTranslation()

    return (
      <>
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

        <Button title={t('approve')} onClick={() => {}} />
      </>
    )
  }
)
