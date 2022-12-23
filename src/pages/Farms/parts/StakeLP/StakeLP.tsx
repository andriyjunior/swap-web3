import { AddressZero } from '@ethersproject/constants'
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

interface IStakeLPProps {
  onCancel: () => void
  onConfirm: (amount: string, referrer: string) => void
}

const StyledBody = styled(InnerContainer)`
  margin-bottom: 16px;
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

export const StakeLP: FC<IStakeLPProps> = ({ onCancel, onConfirm }) => {
  const [amount, setAmount] = useState('')
  const { t } = useTranslation()

  const referrer = AddressZero

  const handleConfirm = () => {
    onConfirm(amount, referrer)
  }

  return (
    <div>
      <StyledBody>
        <Flex flexDirection="column" gap="14px">
          <StyledTitle>Stake SAND/MANA</StyledTitle>
          <BigDecimalInput
            textAlign="left"
            value={amount}
            onInput={(value) => setAmount(value)}
          />
        </Flex>
        <Flex flexDirection="column" gap="14px">
          <StyledTitle>Balance: 0.05763243</StyledTitle>
          <Button onClick={() => {}}>Max</Button>
        </Flex>
      </StyledBody>
      <SimpleButton href="234sdf" icon="link" variant="secondary">
        {t('Get SAND/MANA')}
      </SimpleButton>
      <StyledButtons gap="16px">
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <Button onClick={handleConfirm}>{t('confirm')}</Button>
      </StyledButtons>
    </div>
  )
}
