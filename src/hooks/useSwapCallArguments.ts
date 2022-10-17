import { Contract } from '@ethersproject/contracts'
import {
  JSBI,
  Percent,
  Router,
  SwapParameters,
  Trade,
  TradeType,
} from 'packages/swap-sdk'

import { useMemo } from 'react'
import { BIPS_BASE } from 'config/constants/exchange'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { getRouterContract } from 'utils/exchange'
import {
  selectUserDeadline,
  selectUserDeadlineRaw,
  useAppSelector,
} from 'store'
import { useWeb3React } from '@web3-react/core'

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
export function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE // in bips
): SwapCall[] {
  const { account, chainId, library } = useWeb3React()

  const recipient = !recipientAddress ? account : recipientAddress
  const deadline = useAppSelector(selectUserDeadlineRaw)

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId || !deadline)
      return []

    const contract = getRouterContract(chainId, library, account)

    if (!contract) {
      return []
    }

    const swapMethods: any = []

    swapMethods.push(
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: deadline,
      })
    )

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: deadline,
        })
      )
    }

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, deadline, library, recipient, trade])
}
