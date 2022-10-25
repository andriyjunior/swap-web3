import { FC } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { colors } from 'styles'

import { Flex } from '../Flex'
import { Button } from '../Button'

import txSubmited_image from 'assets/transaction-success.png'
import link_icon from 'assets/icons/linkTo.svg'
import { etherscan } from 'const'
import { useWeb3React } from '@web3-react/core'
import { SimpleButton } from '../SimpleButton'
import { registerToken } from 'utils'

const StyledImage = styled.img`
  margin-top: 24px;
  width: 250px;
  height: 250px;
`
const StyledButtons = styled.div`
  padding: 24px 0;
  width: 100%;
  display: flex;
  gap: 24px;
`

interface ITransactionSubmited {
  tokenAddress?: string
  tokenSymbol?: string
  tokenDecimals?: number
  tokenLogo?: string
  onClose: () => void
  txHash?: string
}

export const TransactionSubmited: FC<ITransactionSubmited> = ({
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenLogo,
  onClose,
  txHash,
}) => {
  const { chainId } = useWeb3React()
  const { t } = useTranslation()
  console.log(tokenAddress, 'tokenAddress')
  const handleRegisterToken = () => {
    console.log('tokenAddress, tokenSymbol, tokenDecimals')
    if (tokenAddress && tokenSymbol && tokenDecimals) {
      registerToken(tokenAddress, tokenSymbol, tokenDecimals, tokenLogo)
    }
  }

  return (
    <Flex flexDirection="column" alignItems="center">
      <StyledImage src={txSubmited_image} />
      <StyledButtons>
        {chainId && (
          <SimpleButton href={`${etherscan[chainId]}tx/${txHash}`}>
            EtherScan
          </SimpleButton>
        )}

        {tokenAddress && (
          <SimpleButton onClick={handleRegisterToken}>
            {t('transactionSubmited.addToken', { token: tokenSymbol })}
          </SimpleButton>
        )}
      </StyledButtons>
      <Button title={t('close')} onClick={onClose} />
    </Flex>
  )
}
