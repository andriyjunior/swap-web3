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

export const UnstakeLP: FC<IUnstakeLPProps> = ({ onCancel, onConfirm }) => {
  const [amount, setAmount] = useState('')

  const { t } = useTranslation()

  const handleConfirm = () => {
    onConfirm(amount)
  }

  return (
    <div>
      <StyledBody>
        <Flex flexDirection="column" gap="14px">
          <StyledTitle>Unstake SAND/MANA</StyledTitle>
          <BigDecimalInput onInput={(val) => setAmount(val)} value={amount} />
        </Flex>
        <Flex flexDirection="column" gap="14px">
          <StyledTitle>Balance: 0.05763243</StyledTitle>
          <Button onClick={() => {}}>Max</Button>
        </Flex>
      </StyledBody>
      <StyledButtons gap="16px">
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <Button onClick={handleConfirm}>{t('confirm')}</Button>
      </StyledButtons>
    </div>
  )
}
