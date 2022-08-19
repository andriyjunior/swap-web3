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
  Settings,
  Settings,
} from 'components'
import { AnimatePresence, motion } from 'framer-motion'
import { useSwapForm } from './hooks'
import { useMetaMask } from 'hooks'
import { selectUser, useAppSelector } from 'store'

import wallet_icon from 'assets/icons/wallet.svg'
import { AnimatePresence, motion } from 'framer-motion'

export const SwapForm: FC = () => {
  const { t } = useTranslation()
  const { accountAddress } = useAppSelector(selectUser)
  const { connect } = useMetaMask()
  const settingsModalRef = useRef<TModal>(null)

  const { state, handleOnChange, handleSwapInputs } = useSwapForm()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Modal ref={settingsModalRef} title={'Setting'}>
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
          tokenName={state.inputToken}
          title={t('swapForm.youSell')}
          icon={state.inputLogoURI}
          amount={state.inputAmount}
          onInput={(value) => handleOnChange({ inputAmount: value })}
          onSelectToken={(value) =>
            handleOnChange({
              inputToken: value.symbol,
              inputLogoURI: value.logoURI,
            })
          }
        />

        <Flex justifyContent="center">
          <IconButton icon="swap" onClick={handleSwapInputs} />
        </Flex>

        <TokenInput
          tokenName={state.outputToken}
          title={t('swapForm.youBuy')}
          icon={state.outputLogoURI}
          amount={state.outputAmount}
          onInput={(value) => handleOnChange({ outputAmount: value })}
          onSelectToken={(value) =>
            handleOnChange({
              outputToken: value.symbol,
              outputLogoURI: value.logoURI,
            })
          }
        />

        {!accountAddress && (
          <Button
            title={t('Connect wallet')}
            icon={wallet_icon}
            onClick={connect}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
