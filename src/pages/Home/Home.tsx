import { Range } from 'components'
import { FC, useState } from 'react'

export const Home: FC = () => {
  const [range, setRange] = useState(0)

  return (
    <>
      <Range
        name="amount"
        value={range}
        onChange={(value) => setRange(value)}
      />
    </>
  )
}
