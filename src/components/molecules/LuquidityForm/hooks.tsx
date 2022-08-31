import { useCallback, useMemo, useState } from 'react'
import { TokenDTO } from 'types'

import allTokenList from 'const/token-list.json'
import useParsedQueryString from 'hooks/useParsedQueryString'

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

export const useLiquidityForm = () => {
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
