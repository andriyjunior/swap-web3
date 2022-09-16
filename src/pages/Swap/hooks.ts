import { Currency } from 'packages/swap-sdk'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import currencyId from 'utils/currencyId'

export const useCurrencySelectRoute = () => {
  const { userCurrencyA, userCurrencyB } = useParams()
  const navigate = useNavigate()

  const [currencyIdA, currencyIdB] = [userCurrencyA, userCurrencyB] || []

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        navigate(`/swap/add/${currencyIdB}/${currencyIdA}`, {
          replace: true,
        })
      } else if (currencyIdB) {
        navigate(`/swap/add/${newCurrencyIdA}/${currencyIdB}`, {
          replace: true,
        })
      } else {
        navigate(`/swap/add/${newCurrencyIdA}`, {
          replace: true,
        })
      }
    },
    [currencyIdB, navigate, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyId(currencyB_)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          navigate(`/swap/add/${currencyIdB}/${newCurrencyIdB}`, {
            replace: true,
          })
        } else {
          navigate(`/swap/add/${newCurrencyIdB}`, {
            replace: true,
          })
        }
      } else {
        navigate(`/swap/add/${currencyIdA || 'ETH'}/${newCurrencyIdB}`, {
          replace: true,
        })
      }
    },
    [currencyIdA, navigate, currencyIdB]
  )

  return {
    handleCurrencyASelect,
    handleCurrencyBSelect,
  }
}
