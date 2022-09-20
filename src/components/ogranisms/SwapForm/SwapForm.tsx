import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Typography,
  IconButton,
  Button,
  TokenInput,
  Modal,
  Settings,
  WalletConnection,
} from 'components'
import { AnimatePresence, motion } from 'framer-motion'
import { useAllTokens, useMetamaskConnection, useModalRef } from 'hooks'
import { useWeb3React } from '@web3-react/core'
import { selectUser, useAppSelector } from 'store'
import { TokenDTO } from 'types'
import { useSwapForm } from './hooks'

import wallet_icon from 'assets/icons/wallet.svg'
import allTokens from 'const/token-list.json'
import { Token } from 'packages/swap-sdk'

export const SwapForm: FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const walletsRef = useModalRef()
  const settingsModalRef = useModalRef()

  const { state, handleOnChange, handleSwapInputs } = useSwapForm()

  const getTokenList = useAllTokens()

  return (
    <>
      <Modal ref={walletsRef} title={t('walletConnection.connectToAWallet')}>
        <WalletConnection onClick={() => walletsRef.current?.close()} />
      </Modal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Modal ref={settingsModalRef} title={t('settings')}>
            <Settings />
          </Modal>

          <Typography.Header4>{t('swapForm.swapTokens')}</Typography.Header4>

          <Flex alignItems="center" justifyContent="space-between">
            <Typography.Title>
              {t('swapForm.tradeTokensInAnInstant')}
            </Typography.Title>

            <IconButton
              icon="settings"
              onClick={() => settingsModalRef.current?.open()}
            />
          </Flex>

          <TokenInput
            tokenName={state.inputToken.symbol}
            title={t('swapForm.youSell')}
            icon={state.inputToken.logoURI}
            amount={state.inputAmount}
            onInput={(value) => handleOnChange({ inputAmount: value })}
            onSelectToken={() => {}}
          />

          <Flex justifyContent="center">
            <IconButton icon="swap" onClick={handleSwapInputs} />
          </Flex>

          <TokenInput
            tokenName={state.outputToken.symbol}
            title={t('swapForm.youBuy')}
            icon={state.outputToken.logoURI}
            amount={state.outputAmount}
            onInput={(value) => handleOnChange({ outputAmount: value })}
            onSelectToken={() => {}}
          />

          {!account && (
            <Button
              title={t('Connect wallet')}
              icon={wallet_icon}
              onClick={() => walletsRef.current?.open()}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
