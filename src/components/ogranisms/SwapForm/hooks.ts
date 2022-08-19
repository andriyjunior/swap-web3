import { useParsedQueryString } from 'hooks'
import { useCallback, useMemo, useState } from 'react'

interface IForm {
  inputToken: string
  inputAmount: string
  inputLogoURI: string
  outputToken: string
  outputAmount: string
  outputLogoURI: string
}

const initialState = {
  inputToken: 'BUSD',
  inputAmount: '',
  inputLogoURI:
    'https://raw.githubusercontent.com/ApeSwapFinance/apeswap-dex/main/public/images/coins/BUSD.svg',
  outputToken: 'ETH',
  outputAmount: '',
  outputLogoURI:
    'https://raw.githubusercontent.com/ApeSwapFinance/apeswap-dex/main/public/images/coins/ETH.svg',
}

export const useSwapForm = () => {
  const [state, setState] = useState<IForm>(initialState)

  const parsedQs = useParsedQueryString()

  console.log(parsedQs)

  const handleOnChange = useCallback((value: { [x: string]: string }) => {
    setState((prev) => {
      return { ...prev, ...value }
    })
  }, [])

  const handleSwapInputs = useCallback(() => {
    setState((prev) => {
      return {
        ...prev,
        inputToken: state.outputToken,
        inputAmount: state.outputAmount,
        inputLogoURI: state.outputLogoURI,
        outputToken: state.inputToken,
        outputAmount: state.inputAmount,
        outputLogoURI: state.inputLogoURI,
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
