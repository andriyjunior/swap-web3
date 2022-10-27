import { FC } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Currency } from 'packages/swap-sdk'

import { Flex } from '../Flex'
import { Button } from '../Button'

import txSubmited_image from 'assets/transaction-success.png'
import link_icon from 'assets/icons/linkTo.svg'
import { etherscan } from 'const'
import { SimpleButton } from '../SimpleButton'
import { registerToken } from 'utils'
import { useActiveWeb3React, wrappedCurrency } from 'hooks'

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
  onClose: () => void
  currencyToAdd?: Currency | undefined
  txHash?: string
}

export const TransactionSubmited: FC<ITransactionSubmited> = ({
  onClose,
  currencyToAdd,
  txHash,
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const token = wrappedCurrency(currencyToAdd, chainId)

  const handleRegisterToken = () => {
    if (token && token.address && token.symbol && token.decimals) {
      registerToken(token.address, token.symbol, token.decimals)
    }
  }

  return (
    <Flex flexDirection="column" alignItems="center">
      <StyledImage src={txSubmited_image} />
      <StyledButtons>
        {chainId && (
          <SimpleButton href={`${etherscan[chainId]}tx/${txHash}`} icon="link">
            EtherScan
          </SimpleButton>
        )}

        {token && (
          <SimpleButton onClick={handleRegisterToken} icon="wallet">
            {t('transactionSubmited.addToken', { token: token?.symbol })}
          </SimpleButton>
        )}
      </StyledButtons>
      <Button title={t('close')} onClick={onClose} />
    </Flex>
  )
}
