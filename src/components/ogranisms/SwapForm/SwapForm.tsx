import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Typography,
  IconButton,
  Button,
  TokenInput,
  Modal,
  TModal,
} from 'components'
import { useMetaMask } from 'hooks'
import { selectUser, useAppSelector } from 'store'
import styled from 'styled-components'

import wallet_icon from 'assets/icons/wallet.svg'

// interface ISwapProps {}

const StyledHeader = styled(Flex)`
  padding-top: 18px;
`

export const SwapForm: FC = () => {
  const { t } = useTranslation()
  const { accountAddress } = useAppSelector(selectUser)
  const { connect } = useMetaMask()

  const modalRef = useRef<TModal>(null)

  return (
    <>
      <Modal ref={modalRef} title="Settings">
        Setting
      </Modal>
      <Typography.Header4>{t('swapForm.swapTokens')}</Typography.Header4>
      <StyledHeader alignItems="center" justifyContent="space-between">
        <Typography.Title>
          {t('swapForm.tradeTokensInAnInstant')}
        </Typography.Title>
        <IconButton icon="settings" onClick={() => modalRef.current?.open()} />
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
