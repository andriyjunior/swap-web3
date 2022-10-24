import { paths } from 'const'
import { Currency } from 'packages/swap-sdk'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import currencyId from 'utils/currencyId'

export const useCurrencySelectRoute = ({
  path,
}: {
  path: 'swap' | 'liquidity'
}) => {
  const { userCurrencyA, userCurrencyB } = useParams()
  const navigate = useNavigate()

  const [currencyIdA, currencyIdB] = [userCurrencyA, userCurrencyB] || []

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        navigate(`/${path}/${currencyIdB}/${currencyIdA}`, {
          replace: true,
        })
      } else if (currencyIdB) {
        navigate(`/${path}/${newCurrencyIdA}/${currencyIdB}`, {
          replace: true,
        })
      } else {
        navigate(`/${path}/${newCurrencyIdA}`, {
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
          navigate(`/${path}/${currencyIdB}/${newCurrencyIdB}`, {
            replace: true,
          })
        } else {
          navigate(`/${path}/${newCurrencyIdB}`, {
            replace: true,
          })
        }
      } else {
        navigate(`/${path}/${currencyIdA || 'ETH'}/${newCurrencyIdB}`, {
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
