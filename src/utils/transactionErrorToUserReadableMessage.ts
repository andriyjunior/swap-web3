/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 * @param t Translation function
 */
export function transactionErrorToUserReadableMessage(error: any, t) {
  let reason: string | undefined
  while (error) {
    reason = error.reason ?? error.data?.message ?? error.message ?? reason
    // eslint-disable-next-line no-param-reassign
    error = error.error ?? error.data?.originalError
  }

  if (reason?.indexOf('execution reverted: ') === 0)
    reason = reason.substring('execution reverted: '.length)

  switch (reason) {
    case 'SevnRouter: EXPIRED':
      return t(
        'The transaction could not be sent because the deadline has passed. Please check that your transaction deadline is not too low.'
      )
    case 'SevnRouter: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'SevnRouter: EXCESSIVE_INPUT_AMOUNT':
    case 'SevnRouter: INSUFFICIENT_A_AMOUNT':
    case 'SevnRouter: INSUFFICIENT_B_AMOUNT':
      return t(
        'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
      )
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return t(
        'The input token cannot be transferred. There may be an issue with the input token.'
      )
    case 'Sevn: TRANSFER_FAILED':
      return t(
        'The output token cannot be transferred. There may be an issue with the output token.'
      )
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        return t(
          'An error occurred when trying to execute this operation. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading.'
        )
      }
      return t('Unknown error . Try increasing your slippage tolerance.')
  }
}
