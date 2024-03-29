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
  TransactionSubmited,
  TransactionErrorContent,
} from 'components'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ApprovalState,
  useActiveWeb3React,
  useAllTokens,
  useApproveCallbackFromTrade,
  useCurrency,
  useIsTransactionUnsupported,
  useModalRef,
  useSwapCallback,
  useWrapCallback,
  wrappedCurrency,
  WrapType,
} from 'hooks'
import {
  selectUserSlippageTolerance,
  useAppSelector,
  useCurrencyBalance,
  useCurrencyBalances,
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSingleTokenSwapInfo,
  useSwapState,
  useUserSingleHopOnly,
} from 'store'
import { confirmPriceImpactWithoutFee, useSwapForm } from './hooks'

import wallet_icon from 'assets/icons/wallet.svg'
import { CurrencyAmount, Token, Trade } from 'packages/swap-sdk'
import { Field } from 'store/features/swap/actions'
import { useSwapActionHandlers } from 'store/features/swap/useSwapActionHandlers'
import { BIG_INT_ZERO } from 'config'
import {
  computeTradePriceBreakdown,
  getTokenUrlByAddress,
  maxAmountSpend,
  warningSeverity,
} from 'utils'
import { SwapConfirm } from './parts'
import styled from 'styled-components'
import { borderRadius, colors, getTransparentColor } from 'styles'

const StyledIssueDescription = styled.div`
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${borderRadius.primary};
  border: 1px solid ${getTransparentColor(colors.black, 0.05)};
`

export const SwapForm: FC = () => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()

  const walletsRef = useModalRef()
  const txErrorRef = useModalRef()
  const submitedRef = useModalRef()
  const confirmSwapRef = useModalRef()
  const settingsModalRef = useModalRef()

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
  const allowedSlippage = useAppSelector(selectUserSlippageTolerance)

  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

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

  useEffect(() => {
    if (swapErrorMessage?.trim()?.length) {
      txErrorRef.current?.open()
    }
  }, [swapErrorMessage])

  useEffect(() => {
    if (txHash && submitedRef.current) {
      submitedRef.current.open()
    }
  }, [txHash, submitedRef])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
    })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

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
    Number(allowedSlippage),
    chainId
  )

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT]
  )

  const atMaxAmountInput = Boolean(
    maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)
  )

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    recipient,
    Number(allowedSlippage)
  )

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleResetSwap = () => {
    if (txHash) {
      handleTypeInput('0')
      handleTypeOutput('0')
    }
  }

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

        if (confirmSwapRef.current) {
          confirmSwapRef.current.close()
        }
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

  const swapIsUnsupported = useIsTransactionUnsupported(
    currencies?.INPUT,
    currencies?.OUTPUT
  )

  const icons = [
    getTokenUrlByAddress(inputCurrencyId),
    getTokenUrlByAddress(outputCurrencyId),
  ]

  const swapInputIsEmpty =
    !formattedAmounts[Field.INPUT] || !formattedAmounts[Field.OUTPUT]

  const showApproveFlow =
    // !swapInputError &&
    approval === ApprovalState.NOT_APPROVED ||
    approval === ApprovalState.PENDING

  const swapIsDisabled =
    showApproveFlow || swapInputIsEmpty || priceImpactSeverity > 3

  const [balanceInput, balanceOutput] = useCurrencyBalances(
    account ?? undefined,
    [currencies[Field.INPUT], currencies[Field.OUTPUT]]
  )

  return (
    <>
      <Modal ref={walletsRef} title={t('walletConnection.connectToAWallet')}>
        <WalletConnection onClick={() => walletsRef.current?.close()} />
      </Modal>

      <Modal ref={txErrorRef} title={t('error')}>
        <TransactionErrorContent
          onClose={() => txErrorRef.current?.close()}
          description={swapErrorMessage}
        />
      </Modal>

      <Modal
        ref={submitedRef}
        title={t('transactionSubmited.transactionSubmited')}
        onClose={handleResetSwap}
      >
        <TransactionSubmited
          currencyToAdd={trade?.outputAmount.currency}
          txHash={txHash}
          onClose={() => {
            submitedRef.current?.close()
            handleResetSwap()
          }}
        />
      </Modal>
      <Modal title={t('swapForm.confirmSwap')} ref={confirmSwapRef}>
        <SwapConfirm
          trade={trade}
          originalTrade={tradeToConfirm}
          onAcceptChanges={handleAcceptChanges}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          recipient={recipient}
          allowedSlippage={Number(allowedSlippage)}
          onConfirm={handleSwap}
          swapErrorMessage={swapErrorMessage}
          icons={icons}
        />
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
            icon={icons[0]}
            amount={formattedAmounts[Field.INPUT]}
            onInput={handleTypeInput}
            onSelectToken={handleInputSelect}
            balance={balanceInput}
            onMax={handleTypeInput}
          />

          <Flex justifyContent="center">
            <IconButton icon="swap" onClick={onSwitchTokens} />
          </Flex>

          <TokenInput
            currency={currencies[Field.OUTPUT] || undefined}
            tokenName={outputCurrency?.symbol || ''}
            title={t('swapForm.youBuy')}
            icon={icons[1]}
            amount={formattedAmounts[Field.OUTPUT]}
            onInput={handleTypeOutput}
            onSelectToken={handleOutputSelect}
            balance={balanceOutput}
            onMax={handleTypeOutput}
          />

          {userHasSpecifiedInputOutput && noRoute ? (
            <StyledIssueDescription>
              {t('Insufficient liquidity for this trade')}
              {singleHopOnly && <p>{t('Try enabling multi-hop trades.')}</p>}
            </StyledIssueDescription>
          ) : !account ? (
            <Button
              title={t('connectWallet')}
              icon={wallet_icon}
              onClick={() => walletsRef.current?.open()}
            />
          ) : swapIsUnsupported ? (
            <Button
              title={t('swapForm.unsupportedAsset')}
              onClick={() => {}}
              isDisabled
            />
          ) : (
            <Flex gap="16px">
              {showApproveFlow && (
                <Button
                  // variant={
                  //   approval === ApprovalState.APPROVED ? 'success' : 'primary'
                  // }
                  title={t('enable')}
                  onClick={approveCallback}
                  isDisabled={
                    approval !== ApprovalState.NOT_APPROVED || approvalSubmitted
                  }
                />
              )}
              {/* {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                {t('Enabling')} <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
              t('Enabled')
            ) : (
              t('Enable %asset%', {
                asset: currencies[Field.INPUT]?.symbol ?? '',
              })
            )} */}
              {/* </Button> */}
              <Button
                title={
                  swapInputIsEmpty
                    ? t('swap')
                    : priceImpactSeverity > 3
                    ? t('Price Impact High')
                    : priceImpactSeverity > 2
                    ? t('Swap Anyway')
                    : t('swap')
                }
                icon={wallet_icon}
                onClick={() => confirmSwapRef.current?.open()}
                isDisabled={swapIsDisabled}
              />
            </Flex>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
