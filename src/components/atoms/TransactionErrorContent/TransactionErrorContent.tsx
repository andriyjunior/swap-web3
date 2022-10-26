import { FC } from 'react'
import styled from 'styled-components'
import { colors } from 'styles'
import { Typography } from '../Typography'

import error_icon from 'assets/error.png'
import { Button } from '../Button'
import { useTranslation } from 'react-i18next'

interface ITransactionErrorContentProps {
  onClose: () => void
  description?: string
}

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledImg = styled.img``

const StyledDescription = styled(Typography.Body)`
  padding: 24px 48px;
  color: ${colors.error};
`

export const TransactionErrorContent: FC<ITransactionErrorContentProps> = ({
  onClose,
  description,
}) => {
  const { t } = useTranslation()
  return (
    <StyledRoot>
      <StyledImg src={error_icon} />
      <StyledDescription>{description}</StyledDescription>
      <Button title={t('dismiss')} onClick={onClose} />
    </StyledRoot>
  )
}
