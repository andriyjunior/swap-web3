export const paths = {
  swap: '/swap',
  liquidity: '/liquidity',
  removeLiquidity(curr1?, curr2?) {
    return `${this.liquidity}/remove${curr1 ? `/${curr1}` : ''}${
      curr2 ? `/${curr2}` : ''
    }`
  },
}
