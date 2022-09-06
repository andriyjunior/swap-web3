export const sliceAccAddress = (account?: string | null | undefined) => {
  return account ? account.slice(0, 2) + '...' + account.slice(38) : ''
}
