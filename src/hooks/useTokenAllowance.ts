import { Token, TokenAmount } from 'packages/swap-sdk'
import { useMemo } from 'react'
import { useSingleCallResult } from 'store'

import { useTokenContract } from './useContract'

export const useTokenAllowance = (
  token?: Token,
  owner?: string,
  spender?: string
): TokenAmount | undefined => {
  const contract = useTokenContract(token?.address, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(
    () =>
      token && allowance
        ? new TokenAmount(token, allowance.toString())
        : undefined,
    [token, allowance]
  )
}
