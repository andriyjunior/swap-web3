import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Title,
  Header4,
  IconButton,
  TokenSelector,
  Button,
} from 'components'
import styled from 'styled-components'

import wallet_icon from 'assets/icons/wallet.svg'
import setting_icon from 'assets/icons/settings.svg'
import BNB_icon from 'assets/coins/BNB.png'

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
        <IconButton icon={setting_icon} onClick={() => {}} />
      </StyledHeader>
      <TokenSelector title={'BNB'} icon={BNB_icon} />
      <Button
        title={t('Connect wallet')}
        icon={wallet_icon}
        onClick={() => {}}
      />
    </>
  )
}
