import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Title,
  Header4,
  IconButton,
  Button,
  TokenInput,
} from 'components'
import styled from 'styled-components'

import wallet_icon from 'assets/icons/wallet.svg'

// interface ISwapProps {}

const StyledHeader = styled(Flex)`
  padding-top: 18px;
`

export const SwapForm: FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Header4>{t('swapForm.swapTokens')}</Header4>
      <StyledHeader alignItems="center" justifyContent="space-between">
        <Title>{t('swapForm.tradeTokensInAnInstant')}</Title>
        <IconButton icon="settings" onClick={() => {}} />
      </StyledHeader>
      <TokenInput title={t('swapForm.youSell')} />
      <Flex justifyContent="center">
        <IconButton icon="swap" onClick={() => {}} />
      </Flex>
      <TokenInput title={t('swapForm.youBuy')} />
      <Button
        title={t('Connect wallet')}
        icon={wallet_icon}
        onClick={() => {}}
      />
    </>
  )
}
