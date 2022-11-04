import { ChangeEvent, FC, useEffect, useState } from 'react'
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
import { escapeRegExp } from 'lodash'

// interface ISettingsProps {}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

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
      value: 10,
      key: '0.1%',
    },
    {
      value: 50,
      key: '0.5%',
    },
    {
      value: 100,
      key: '1%',
    },
  ],
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3

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
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

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
      tolerance < 100 ||
      tolerance >= 4500 ||
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

  let deadlineError: DeadlineError | undefined

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)
      try {
        const valueAsIntFromRoundedFloat = Number.parseInt(
          (Number.parseFloat(value) * 100).toString()
        )
        if (
          !Number.isNaN(valueAsIntFromRoundedFloat) &&
          valueAsIntFromRoundedFloat < 5000
        ) {
          handleOnChangeTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const parseCustomDeadline = (value: string) => {
    console.log(value)
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (
        !Number.isNaN(valueAsInt) &&
        valueAsInt > 60 &&
        valueAsInt < THREE_DAYS_IN_SECONDS
      ) {
        handleOnChangeDeadline(valueAsInt)
      } else {
        deadlineError = DeadlineError.InvalidInput
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Typography.Title>
        {t('userSettings.defaultTransactionSpeed')}
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
      <Typography.Title>{t('userSettings.slippageTolerance')}</Typography.Title>
      <Flex justifyContent="space-between" alignItems="center">
        {data2.options.map((item) => {
          return (
            <RadioButton
              checked={userSlippageTolerance === Number(item.value)}
              key={item.key}
              title={t(item.key)}
              name={data2.name}
              value={item.value}
              onChange={(value) => {
                setSlippageInput('')
                handleOnChangeTolerance(value.userSlippageTolerance)
              }}
            />
          )
        })}
        <NumberInput
          value={slippageInput}
          placeholder={(userSlippageTolerance / 100).toFixed(2)}
          error={Boolean(errors?.transactionTolerance)}
          onChange={(event) => {
            if (event.currentTarget.validity.valid) {
              parseCustomSlippage(event.target.value.replace(/,/g, '.'))
            }
          }}
          onBlur={() => {
            parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
          }}
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
        {t('userSettings.transactionDeadline')}
      </Typography.Title>
      <NumberInput
        value={deadlineInput}
        placeholder={(userDeadline / 60).toString()}
        inputMode="numeric"
        pattern="^[0-9]+$"
        onBlur={() => {
          parseCustomDeadline((userDeadline / 60).toString())
        }}
        onChange={(event) => {
          if (event.currentTarget.validity.valid) {
            parseCustomDeadline(event.target.value)
          }
        }}
      />
      <StyledLabel>{t('minutes')}</StyledLabel>
    </>
  )
}
