import {
  Flex,
  HorizontalSeparator,
  NumberInput,
  RadioButton,
  Typography,
} from 'components'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'

// interface ISettingsProps {}

enum TransactionSpeedEnum {
  Default = 'default',
  Fast = 'fast',
  Instant = 'instant',
}

const data = {
  name: 'speed',
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
  name: 'tolerance',
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

export const Settings: FC = () => {
  const [state, setState] = useState<{
    speed: TransactionSpeedEnum
    tolerance: string
    minutes: string
  }>({ speed: TransactionSpeedEnum.Default, tolerance: '0.1', minutes: '0' })
  const { t } = useTranslation()

  const handleOnChange = (value: { [x: string]: string | number }) => {
    setState((prev) => {
      return { ...prev, ...value }
    })
  }
  return (
    <>
      <Typography.Title>
        {t('swapSettings.defaultTransactionSpeed')}
      </Typography.Title>
      <Flex justifyContent="space-between" alignItems="center">
        {data.options.map((item) => {
          return (
            <RadioButton
              checked={state.speed === item.value}
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
              checked={Number(state.tolerance) === Number(item.value)}
              key={item.key}
              title={t(item.key)}
              name={data2.name}
              value={item.value}
              onChange={(value) => handleOnChange(value)}
            />
          )
        })}
        <NumberInput
          value={state.tolerance}
          onInput={(value) => handleOnChange({ tolerance: value })}
          placeholder={'0.0'}
        />
        <StyledLabel>%</StyledLabel>
      </Flex>
      <HorizontalSeparator />
      <Typography.Title>
        {t('swapSettings.transactionDeadline')}
      </Typography.Title>
      <NumberInput
        value={state.minutes}
        onInput={(value) => handleOnChange({ minutes: value })}
        placeholder={'0'}
      />
      <StyledLabel>{t('minutes')}</StyledLabel>
    </>
  )
}
