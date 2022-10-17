import { FC, useCallback, useEffect, useMemo, useState } from 'react'
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
import {
  ApprovalState,
  useAllTokens,
  useApproveCallbackFromTrade,
  useCurrency,
  useModalRef,
  useSwapCallback,
  useWrapCallback,
  WrapType,
} from 'hooks'
import {
  selectUserSlippageTolerance,
  useAppSelector,
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSingleTokenSwapInfo,
  useSwapState,
  useUserSingleHopOnly,
} from 'store'
import { useWeb3React } from '@web3-react/core'
import { confirmPriceImpactWithoutFee, useSwapForm } from './hooks'

import wallet_icon from 'assets/icons/wallet.svg'
import { Token, Trade } from 'packages/swap-sdk'
import { Field } from 'store/features/swap/actions'
import { useSwapActionHandlers } from 'store/features/swap/useSwapActionHandlers'
import { BIG_INT_ZERO } from 'config'
import { computeTradePriceBreakdown, warningSeverity } from 'utils'
import { SwapConfirm } from './parts'

export const SwapForm: FC = () => {
  const { t } = useTranslation()
  const { account, chainId } = useWeb3React()

  const walletsRef = useModalRef()
  const confirmSwapRef = useModalRef()
  const settingsModalRef = useModalRef()

  const { state, handleOnChange, handleSwapInputs } = useSwapForm()

  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]

  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )

  const defaultTokens = useAllTokens()

  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  // get custom setting values for user
  const [allowedSlippage] = useAppSelector(selectUserSlippageTolerance)

  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  console.log('recipient', recipient)
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrency!,
    outputCurrency!,
    recipient
  )

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const singleTokenPrice = useSingleTokenSwapInfo(
    inputCurrencyId,
    inputCurrency!,
    outputCurrencyId,
    outputCurrency!
  )

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]:
          independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]:
          independentField === Field.OUTPUT
            ? parsedAmount
            : trade?.outputAmount,
      }

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  // modal and loading
  const [
    { tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(BIG_INT_ZERO)
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback]: any = useApproveCallbackFromTrade(
    trade,
    chainId,
    Number(allowedSlippage)
  )

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    recipient,
    Number(allowedSlippage)
  )

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (
      priceImpactWithoutFee &&
      !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)
    ) {
      return
    }

    if (!swapCallback) {
      return
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    })

    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const handleInputSelect = useCallback(
    (currencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)
      // const showSwapWarning = shouldShowSwapWarning(currencyInput)
      // if (showSwapWarning) {
      //   setSwapWarningCurrency(currencyInput)
      // } else {
      //   setSwapWarningCurrency(null)
      // }
    },
    [onCurrencySelection]
  )

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(Field.OUTPUT, currencyOutput)
      // const showSwapWarning = shouldShowSwapWarning(currencyOutput)
      // if (showSwapWarning) {
      //   setSwapWarningCurrency(currencyOutput)
      // } else {
      //   setSwapWarningCurrency(null)
      // }
    },

    [onCurrencySelection]
  )

  return (
    <>
      <Modal ref={walletsRef} title={t('walletConnection.connectToAWallet')}>
        <WalletConnection onClick={() => walletsRef.current?.close()} />
      </Modal>
      <Modal title={t('swapForm.confirmSwap')} ref={confirmSwapRef}>
        <SwapConfirm onConfirm={handleSwap} />
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
            currency={currencies[Field.INPUT] || undefined}
            tokenName={inputCurrency?.symbol || ''}
            title={t('swapForm.youSell')}
            icon={state.inputToken.logoURI}
            amount={formattedAmounts[Field.INPUT]}
            onInput={handleTypeInput}
            onSelectToken={handleInputSelect}
          />

          <Flex justifyContent="center">
            <IconButton icon="swap" onClick={onSwitchTokens} />
          </Flex>

          <TokenInput
            currency={currencies[Field.OUTPUT] || undefined}
            tokenName={outputCurrency?.symbol || ''}
            title={t('swapForm.youBuy')}
            icon={state.outputToken.logoURI}
            amount={formattedAmounts[Field.OUTPUT]}
            onInput={handleTypeOutput}
            onSelectToken={handleOutputSelect}
          />

          {!account ? (
            <Button
              title={t('connectWallet')}
              icon={wallet_icon}
              onClick={() => walletsRef.current?.open()}
            />
          ) : (
            <Button
              title={t('swap')}
              icon={wallet_icon}
              onClick={() => confirmSwapRef.current?.open()}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
