import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectSwapSettings,
  updateSwapSettings,
  useAppDispatch,
  useAppSelector,
} from 'store'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'
import { TransactionSpeedEnum } from 'types'
import {
  Flex,
  HorizontalSeparator,
  NumberInput,
  RadioButton,
  Typography,
} from 'components'

// interface ISettingsProps {}

const data = {
  name: 'transactionSpeed',
  options: [
    {
      value: TransactionSpeedEnum.Default,
      key: 'default',
    },
    {
      value: TransactionSpeedEnum.Fast,
      key: 'fast',
    },
    {
      value: TransactionSpeedEnum.Instant,
      key: 'instant',
    },
  ],
}

const data2 = {
  name: 'transactionTolerance',
  options: [
    {
      value: '0.1',
      key: '0.1%',
    },
    {
      value: '0.5',
      key: '0.5%',
    },
    {
      value: '1',
      key: '1%',
    },
  ],
}

const StyledLabel = styled.span`
  margin-left: 10px;
  font-size: 14px;
  color: ${getTransparentColor(colors.black, 0.5)};
`

const ErrorMessage = styled(Typography.Body)`
  padding-top: 16px;
`

export const Settings: FC = () => {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()

  const state = useAppSelector(selectSwapSettings)
  const [errors, setErrors] = useState<{ [x: string]: string }>({})

  const handleOnChange = (value: { [x: string]: string | number }) => {
    dispatch(updateSwapSettings(value))
  }

  const handleOnError = () => {
    const isEmpty = (value: string) => !value.length
    const tolerance = Number(state.transactionTolerance)

    if (
      tolerance < 0.1 ||
      tolerance >= 50 ||
      isEmpty(state.transactionTolerance)
    ) {
      setErrors((prev) => {
        return {
          ...prev,
          transactionTolerance: 'Please enter valid slippage percentage',
        }
      })
    } else {
      setErrors({})
    }
  }

  useEffect(handleOnError, [state])

  return (
    <>
      <Typography.Title>
        {t('swapSettings.defaultTransactionSpeed')}
      </Typography.Title>
      <Flex justifyContent="space-between" alignItems="center">
        {data.options.map((item) => {
          return (
            <RadioButton
              checked={state.transactionSpeed === item.value}
              key={item.key}
              title={t(item.key)}
              name={data.name}
              value={item.value}
              onChange={handleOnChange}
            />
          )
        })}
      </Flex>
      <HorizontalSeparator />
      <Typography.Title>{t('swapSettings.slippageTolerance')}</Typography.Title>
      <Flex justifyContent="space-between" alignItems="center">
        {data2.options.map((item) => {
          return (
            <RadioButton
              checked={
                Number(state.transactionTolerance) === Number(item.value)
              }
              key={item.key}
              title={t(item.key)}
              name={data2.name}
              value={item.value}
              onChange={(value) => handleOnChange(value)}
            />
          )
        })}
        <NumberInput
          value={state.transactionTolerance}
          onInput={(value) => handleOnChange({ transactionTolerance: value })}
          placeholder={'0.0'}
          error={Boolean(errors?.transactionTolerance)}
        />
        <StyledLabel>%</StyledLabel>
      </Flex>
      {errors?.transactionTolerance && (
        <ErrorMessage isError={Boolean(errors?.transactionTolerance)}>
          {errors?.transactionTolerance}
        </ErrorMessage>
      )}
      <HorizontalSeparator />
      <Typography.Title>
        {t('swapSettings.transactionDeadline')}
      </Typography.Title>
      <NumberInput
        value={state.transactionDeadline}
        onInput={(value) => handleOnChange({ transactionDeadline: value })}
        placeholder={'0'}
      />
      <StyledLabel>{t('minutes')}</StyledLabel>
    </>
  )
}
