import { FC, memo, useCallback, useEffect, useState } from 'react'
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

const initialState = {
  inputType: 'input',
  amount: '',
  percentOfAmount: 0,
}

const allAmount = 1.4

interface IRemoveLiquidity {
  onGoBack: () => void
}

export const RemoveLiquidity: FC<IRemoveLiquidity> = memo(({ onGoBack }) => {
  const [state, setState] = useState(initialState)

  const handleOnChange = useCallback((value) => {
    setState((prev) => {
      return {
        ...prev,
        ...value,
      }
    })
  }, [])

  useEffect(() => {
    if (state.inputType === 'other') {
      handleOnChange({ amount: (allAmount / 100) * state.percentOfAmount })
    }
  }, [state.percentOfAmount])

  useEffect(() => {
    if (state.inputType === 'input') {
      handleOnChange({
        percentOfAmount: (Number(state.amount) * 100) / allAmount,
      })
    }
  }, [state.amount])

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
          value={state.amount}
          onInput={(value) => {
            if (Number(value) <= allAmount) {
              handleOnChange({ amount: value, inputType: 'input' })
            }
          }}
          textAlign="left"
        />
        <Range
          step={10}
          value={state.percentOfAmount}
          onChange={(value) =>
            handleOnChange({ percentOfAmount: value, inputType: 'other' })
          }
          name={'amount'}
        />

        <StyledRadioContainer>
          {data2.options.map((item) => {
            return (
              <RadioButton
                checked={Number(item.value) === Number(state.percentOfAmount)}
                key={item.key}
                title={t(item.key)}
                name={data2.name}
                value={item.value}
                onChange={(value) =>
                  handleOnChange({ ...value, inputType: 'other' })
                }
              />
            )
          })}
        </StyledRadioContainer>
      </StyledContainer>
      <StyledContainer>
        <Flex flexDirection="column">
          <Flex justifyContent="space-between" alignItems="center">
            <StyledTokenLiquidityAmount>0.27433</StyledTokenLiquidityAmount>
            <TokenSelector title={'AXIE'} />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <StyledTokenLiquidityAmount>0.005765</StyledTokenLiquidityAmount>
            <TokenSelector title={'BNB'} />
          </Flex>
        </Flex>
      </StyledContainer>

      <StyledPriceContainer justifyContent="space-between">
        <StyledTokenPrice>{t('price')}:</StyledTokenPrice>
        <Flex flexDirection="column" alignItems="flex-end">
          <StyledTokenPrice>1 BNB = 0.0352 AXIE</StyledTokenPrice>
          <StyledTokenPrice>1 AXIE = 58.36 BNB</StyledTokenPrice>
        </Flex>
      </StyledPriceContainer>

      <Button title={t('approve')} onClick={() => {}} />
    </>
  )
})
