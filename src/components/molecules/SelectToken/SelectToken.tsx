import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  ImportTokenConfirmation,
  InnerContainer,
  Input,
  Modal,
  TokenSelector,
  Typography,
} from 'components'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'
import {
  useActiveWeb3React,
  useAllTokens,
  useDebounce,
  useModalRef,
  useToken,
  wrappedCurrency,
} from 'hooks'
import { Currency, ETHER, Token } from 'packages/swap-sdk'
import { useAddUserToken, WrappedTokenInfo } from 'store'

import ETH_icon from 'assets/coins/ETH.png'
import QUESTION_MARK_icon from 'assets/coins/QUESTION_MARK.png'
import { getTokenUrlByAddress } from 'utils'

interface ISelectTokenProps {
  onSelect: (value: Token | Currency) => void
  onManageTokens?: () => void
}

const StyledList = styled(InnerContainer)`
  padding: 12px 10px;
  height: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;

  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: ${getTransparentColor(colors.black, 0.25)};
  }
  &::-webkit-scrollbar {
    width: 4px;
    background-color: ${getTransparentColor(colors.black, 0.25)};
    border-radius: 2px;
  }
`

const StyledButton = styled.div`
  margin-top: 16px;
`

export const SelectToken: FC<ISelectTokenProps> = ({
  onSelect,
  onManageTokens,
}) => {
  const { chainId } = useActiveWeb3React()
  const allTokensList = useAllTokens()

  const [tokenList, setTokenList] = useState<Token[]>([])
  const [input, setInput] = useState('')
  const debouncedQuery = useDebounce(input, 200)

  const foundToken = useToken(debouncedQuery) as Token
  const addToken = useAddUserToken()

  const modalRef = useModalRef()

  const { t } = useTranslation()

  useEffect(() => {
    setTokenList(Object.values(allTokensList))
  }, [])

  useEffect(() => {
    const filteredTokens = Object.values(allTokensList).filter((item) => {
      const debouncedTrimmed = debouncedQuery.toLowerCase().trim()
      const listOfQuerry = [
        item?.symbol?.toLowerCase().includes(debouncedTrimmed),
        item?.address?.toLowerCase().includes(debouncedTrimmed),
      ]

      if (listOfQuerry.some((itemTrue) => itemTrue)) {
        return item
      }
    })
    setTokenList(filteredTokens || allTokensList)
  }, [debouncedQuery, foundToken])

  const ETH_TOKEN = chainId && (wrappedCurrency(ETHER, chainId) as Token)

  const handleManageTokens = () => {
    if (onManageTokens) {
      onManageTokens()
    }
  }

  const handleImport = () => {
    if (foundToken) {
      addToken(foundToken)
    }
    if (modalRef.current) {
      modalRef.current.close()
    }
  }

  return (
    <>
      {foundToken && (
        <Modal ref={modalRef} title={t('importToken')}>
          <ImportTokenConfirmation
            onImport={handleImport}
            symbol={foundToken.symbol ?? ''}
            address={foundToken.address}
          />
        </Modal>
      )}
      <Input
        value={input}
        onInput={setInput}
        placeholder={t('selectToken.searchByNameOrPasteAdress')}
      />
      <Typography.Title>{t('selectToken.tokenName')}</Typography.Title>
      <StyledList>
        {ETH_TOKEN && (
          <TokenSelector
            key={ETH_TOKEN?.address}
            icon={ETH_icon}
            token={ETHER as Token}
            onClick={() => onSelect(ETHER)}
          />
        )}
        {tokenList.map((item) => {
          return (
            <TokenSelector
              key={item.address}
              icon={
                item instanceof WrappedTokenInfo
                  ? item.logoURI
                  : getTokenUrlByAddress(item.address)
              }
              token={item}
              onClick={() => onSelect(item)}
            />
          )
        })}
        {foundToken && !allTokensList[foundToken.address] && (
          <TokenSelector
            key={foundToken?.address}
            icon={
              foundToken instanceof WrappedTokenInfo
                ? foundToken.logoURI
                : getTokenUrlByAddress(foundToken.address)
            }
            token={foundToken}
            onImport={() => modalRef.current?.open()}
          />
        )}
      </StyledList>
      {onManageTokens && (
        <StyledButton>
          <Button title={t('manageTokens')} onClick={handleManageTokens} />
        </StyledButton>
      )}
    </>
  )
}
