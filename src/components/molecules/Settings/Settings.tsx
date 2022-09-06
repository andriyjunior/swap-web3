import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectUser,
  updateSlippageTolerance,
  updateUserDeadline,
  updateUserGasPrice,
  useAppDispatch,
  useAppSelector,
} from 'store'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'
import { GAS_PRICE_GWEI } from 'const'
import {
  Flex,
  HorizontalSeparator,
  NumberInput,
  RadioButton,
  Typography,
} from 'components'

// interface ISettingsProps {}

const data = {
  name: 'gasPrice',
  options: [
    {
      value: GAS_PRICE_GWEI.default,
      key: 'default',
    },
    {
      value: GAS_PRICE_GWEI.fast,
      key: 'fast',
    },
    {
      value: GAS_PRICE_GWEI.instant,
      key: 'instant',
    },
  ],
}

const data2 = {
  name: 'userSlippageTolerance',
  options: [
    {
      value: 0.1,
      key: '0.1%',
    },
    {
      value: 0.5,
      key: '0.5%',
    },
    {
      value: 1,
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

  const { userSlippageTolerance, userDeadline, gasPrice } =
    useAppSelector(selectUser)

  const [errors, setErrors] = useState<{ [x: string]: string }>({})

  // const handleOnChange = (value: { [x: string]: string | number }) => {
  //   dispatch(updateSwapSettings(value))
  // }

  const handleOnChangeTolerance = (value) => {
    dispatch(updateSlippageTolerance(value))
  }

  const handleOnChangeDeadline = (value) => {
    dispatch(updateUserDeadline(value))
  }

  const handleOnChangeGasPrice = (value) => {
    dispatch(updateUserGasPrice(value))
  }

  const handleOnError = () => {
    const isEmpty = (value: string) => !value.length
    const tolerance = Number(userSlippageTolerance)

    if (
      tolerance < 0.1 ||
      tolerance >= 50 ||
      isEmpty(userSlippageTolerance.toString())
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

  useEffect(handleOnError, [userSlippageTolerance, userDeadline, gasPrice])

  return (
    <>
      <Typography.Title>
        {t('swapSettings.defaultTransactionSpeed')}
      </Typography.Title>
      <Flex justifyContent="space-between" alignItems="center">
        {data.options.map((item) => {
          return (
            <RadioButton
              checked={gasPrice === item.value}
              key={item.key}
              title={t(item.key)}
              name={data.name}
              value={item.value}
              onChange={(value) => handleOnChangeGasPrice(value[data.name])}
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
              checked={Number(userSlippageTolerance) === Number(item.value)}
              key={item.key}
              title={t(item.key)}
              name={data2.name}
              value={item.value}
              onChange={(value) =>
                handleOnChangeTolerance(value.userSlippageTolerance)
              }
            />
          )
        })}
        <NumberInput
          value={userSlippageTolerance}
          onInput={(value) => handleOnChangeTolerance(value)}
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
        value={userDeadline.toString()}
        onInput={(value) => handleOnChangeDeadline(value)}
        placeholder={'0'}
      />
      <StyledLabel>{t('minutes')}</StyledLabel>
    </>
  )
}
