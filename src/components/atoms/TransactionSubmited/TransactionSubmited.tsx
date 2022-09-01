import { FC } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { colors } from 'styles'

import { Flex } from '../Flex'
import { Button } from '../Button'

import txSubmited_image from 'assets/transaction-success.png'
import link_icon from 'assets/icons/linkTo.svg'

const StyledImage = styled.img`
  margin-top: 24px;
  width: 250px;
  height: 250px;
`
const StyledIcon = styled.img`
  width: 22px;
  height: 22px;
`

const StyledLink = styled.a`
  margin: 34px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: ${colors.orange};

  &:hover {
    text-decoration: underline;
  }
`

interface ITransactionSubmited {
  onClose: () => void
}

export const TransactionSubmited: FC<ITransactionSubmited> = ({ onClose }) => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column" alignItems="center">
      <StyledImage src={txSubmited_image} />
      <Flex alignItems="center">
        <StyledLink href="#">
          {t('transactionSubmited.viewOnEtherScan')}
          <StyledIcon src={link_icon} />
        </StyledLink>
      </Flex>
      <Button title={t('close')} onClick={onClose} />
    </Flex>
  )
}
