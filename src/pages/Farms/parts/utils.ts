const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60
const BLOCKS_IN_A_YEAR = SECONDS_PER_YEAR / 14

export const aprToApy = (interest, frequency = BLOCKS_IN_A_YEAR) =>
  ((1 + interest / 100 / frequency) ** frequency - 1) * 100
