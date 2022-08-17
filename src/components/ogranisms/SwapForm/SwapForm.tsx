import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Typography, IconButton, Button, TokenInput } from 'components'
import styled from 'styled-components'

import wallet_icon from 'assets/icons/wallet.svg'
import { useMetaMask } from 'hooks'
import { selectUser, useAppSelector } from 'store'

// interface ISwapProps {}

const StyledHeader = styled(Flex)`
  padding-top: 18px;
`

export const SwapForm: FC = () => {
  const { t } = useTranslation()
  const { accountAddress } = useAppSelector(selectUser)
  const { connect } = useMetaMask()

  return (
    <>
      <Typography.Header4>{t('swapForm.swapTokens')}</Typography.Header4>
      <StyledHeader alignItems="center" justifyContent="space-between">
        <Typography.Title>
          {t('swapForm.tradeTokensInAnInstant')}
        </Typography.Title>
        <IconButton icon="settings" onClick={() => {}} />
      </StyledHeader>
      <TokenInput title={t('swapForm.youSell')} />
      <Flex justifyContent="center">
        <IconButton icon="swap" onClick={() => {}} />
      </Flex>
      <TokenInput title={t('swapForm.youBuy')} />
      {!accountAddress && (
        <Button
          title={t('Connect wallet')}
          icon={wallet_icon}
          onClick={connect}
        />
      )}
    </>
  )
}
