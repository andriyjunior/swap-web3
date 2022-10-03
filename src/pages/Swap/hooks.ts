import { paths } from 'const'
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
        navigate(`${paths.liquidity}/${currencyIdB}/${currencyIdA}`, {
          replace: true,
        })
      } else if (currencyIdB) {
        navigate(`${paths.liquidity}/${newCurrencyIdA}/${currencyIdB}`, {
          replace: true,
        })
      } else {
        navigate(`${paths.liquidity}/${newCurrencyIdA}`, {
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
          navigate(`${paths.liquidity}/${currencyIdB}/${newCurrencyIdB}`, {
            replace: true,
          })
        } else {
          navigate(`${paths.liquidity}/${newCurrencyIdB}`, {
            replace: true,
          })
        }
      } else {
        navigate(
          `${paths.liquidity}/${currencyIdA || 'ETH'}/${newCurrencyIdB}`,
          {
            replace: true,
          }
        )
      }
    },
    [currencyIdA, navigate, currencyIdB]
  )

  return {
    handleCurrencyASelect,
    handleCurrencyBSelect,
  }
}
