import { AddressZero } from '@ethersproject/constants'
import { Token } from 'packages/swap-sdk'
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
import { useCurrencyBalance } from 'store'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'
import { useActiveWeb3React, useToken } from 'hooks'

interface IStakeLPProps {
  onCancel: () => void
  onConfirm: (amount: string, referrer: string) => void
  label: string
  tokenAddress: string
  getLPLink?: string
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

export const StakeLP: FC<IStakeLPProps> = ({
  onCancel,
  onConfirm,
  label,
  tokenAddress,
  getLPLink,
}) => {
  const [amount, setAmount] = useState('')

  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const tokenObj = useToken(tokenAddress)

  const balance = useCurrencyBalance(account ?? '', tokenObj ?? undefined)
  const referrer = AddressZero

  const handleConfirm = () => {
    onConfirm(amount, referrer)
  }

  const handleMax = () => {
    if (balance) {
      setAmount(balance?.toSignificant(6))
    }
  }

  return (
    <div>
      <StyledBody>
        <Flex flexDirection="column" gap="14px">
          <StyledTitle>Stake {label}</StyledTitle>
          <BigDecimalInput
            textAlign="left"
            value={amount}
            onInput={(value) => setAmount(value)}
          />
        </Flex>
        <Flex flexDirection="column" gap="14px">
          <StyledTitle>Balance: {balance?.toSignificant(6)}</StyledTitle>
          <Button onClick={handleMax}>Max</Button>
        </Flex>
      </StyledBody>
      {getLPLink && (
        <SimpleButton href={getLPLink} icon="link" variant="secondary">
          {t(`Get {{label}}`, { label: label })}
        </SimpleButton>
      )}
      <StyledButtons gap="16px">
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <Button onClick={handleConfirm}>{t('confirm')}</Button>
      </StyledButtons>
    </div>
  )
}
