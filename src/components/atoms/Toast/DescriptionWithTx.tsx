import { useWeb3React } from '@web3-react/core'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'
import { Typography } from '../Typography'

interface DescriptionWithTxProps {
  children: ReactNode
  description?: string
  txHash?: string
}

const StyledText = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

export const DescriptionWithTx: React.FC<DescriptionWithTxProps> = ({
  children,
  txHash,
}) => {
  return (
    <>
      {typeof children === 'string' ? (
        <StyledText>{children}</StyledText>
      ) : (
        children
      )}
    </>
  )
}
