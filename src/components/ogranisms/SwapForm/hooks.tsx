import { useCallback, useMemo, useState } from 'react'
import { TokenDTO } from 'types'

import allTokenList from 'const/token-list.json'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { Percent } from 'packages/swap-sdk'
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
} from 'config'

interface IForm {
  inputToken: TokenDTO
  inputAmount: string
  outputToken: TokenDTO
  outputAmount: string
}

const initialState = {
  inputToken: allTokenList.tokens[1],
  inputAmount: '',
  outputToken: allTokenList.tokens[2],
  outputAmount: '',
}

interface IErrors {
  [x: string]: string
}

const initialErrors = {}

export const useSwapForm = () => {
  const [state, setState] = useState<IForm>(initialState)
  const [errors, setErrors] = useState<IErrors>(initialErrors)

  const parsedQs = useParsedQueryString()

  const handleOnChange = useCallback(
    (value: { [x: string]: string | TokenDTO }) => {
      setState((prev) => {
        return { ...prev, ...value }
      })
    },
    []
  )

  const handleSwapInputs = useCallback(() => {
    setState((prev) => {
      return {
        ...prev,
        inputToken: state.outputToken,
        inputAmount: state.outputAmount,
        outputToken: state.inputToken,
        outputAmount: state.inputAmount,
      }
    })
  }, [state])

  return useMemo(() => {
    return {
      handleOnChange,
      handleSwapInputs,
      state,
    }
  }, [state])
}

export const confirmPriceImpactWithoutFee = (
  priceImpactWithoutFee: Percent,
  t
): boolean => {
  if (!priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)) {
    const confirmWord = 'confirm'
    return (
      // eslint-disable-next-line no-alert
      window.prompt(
        t(
          'This swap has a price impact of at least %amount%%. Please type the word "%word%" to continue with this swap.',
          {
            amount: PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(0),
            word: confirmWord,
          }
        )
      ) === confirmWord
    )
  }
  if (!priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
    // eslint-disable-next-line no-alert
    return window.confirm(
      t(
        'This swap has a price impact of at least %amount%%. Please confirm that you would like to continue with this swap.',
        {
          amount: ALLOWED_PRICE_IMPACT_HIGH.toFixed(0),
        }
      )
    )
  }
  return true
}
