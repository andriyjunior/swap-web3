import BigNumber from 'bignumber.js'
import {
  BigDecimalInput,
  Button,
  Flex,
  InnerContainer,
  SimpleButton,
  Typography,
} from 'components'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'

interface IUnstakeLPProps {
  onCancel: () => void
  onConfirm: (value: string) => void
  label: string
  balance: string
}

const StyledBody = styled(InnerContainer)`
  height: 102px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledTitle = styled(Typography.Small)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledButtons = styled(Flex)`
  padding-top: 16px;
`

export const UnstakeLP: FC<IUnstakeLPProps> = ({
  onCancel,
  onConfirm,
  label,
  balance,
}) => {
  const [amount, setAmount] = useState('')

  const { t } = useTranslation()

  const handleConfirm = () => {
    onConfirm(amount)
  }

  const handleOnMax = () => {
    setAmount(balance)
  }

  return (
    <div>
      <StyledBody>
        <Flex flexDirection="column" gap="14px">
          <StyledTitle>Unstake {label}</StyledTitle>
          <BigDecimalInput onInput={(val) => setAmount(val)} value={amount} />
        </Flex>
        <Flex flexDirection="column" gap="14px">
          <StyledTitle>Balance: {balance}</StyledTitle>
          <Button onClick={handleOnMax}>Max</Button>
        </Flex>
      </StyledBody>
      <StyledButtons gap="16px">
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <Button onClick={handleConfirm}>{t('confirm')}</Button>
      </StyledButtons>
    </div>
  )
}
