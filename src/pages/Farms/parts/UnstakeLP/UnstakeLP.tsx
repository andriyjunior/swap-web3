import {
  Button,
  Flex,
  InnerContainer,
  SimpleButton,
  Typography,
} from 'components'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'

interface IUnstakeLPProps {
  onCancel: () => void
  onConfirm: () => void
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
  const { t } = useTranslation()

  return (
    <div>
      <StyledBody>
        <Flex flexDirection="column" gap="14px">
          <StyledTitle>Unstake SAND/MANA</StyledTitle>
          <Typography.Header4>0.05763243</Typography.Header4>
        </Flex>
        <Flex flexDirection="column" gap="14px">
          <StyledTitle>Balance: 0.05763243</StyledTitle>
          <Button onClick={() => {}}>Max</Button>
        </Flex>
      </StyledBody>
      <StyledButtons gap="16px">
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <Button onClick={onConfirm}>{t('confirm')}</Button>
      </StyledButtons>
    </div>
  )
}
