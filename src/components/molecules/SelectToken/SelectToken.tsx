import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InnerContainer, Input, TokenSelector, Typography } from 'components'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'
import { useAllTokens, useDebounce, useToken } from 'hooks'
import { Token } from 'packages/swap-sdk'

interface ISelectTokenProps {
  onSelect: (value: Token) => void
}

const StyledList = styled(InnerContainer)`
  padding: 12px 10px;
  height: 400px;
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

export const SelectToken: FC<ISelectTokenProps> = ({ onSelect }) => {
  const allTokensList = useAllTokens()

  const [tokenList, setTokenList] = useState<Token[]>([])
  const [input, setInput] = useState('')
  const debouncedQuery = useDebounce(input, 200)

  const foundToken = useToken(debouncedQuery)

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
  }, [debouncedQuery])

  return (
    <>
      <Input
        value={input}
        onInput={setInput}
        placeholder={t('selectToken.searchByNameOrPasteAdress')}
      />
      <Typography.Title>{t('selectToken.tokenName')}</Typography.Title>
      <StyledList>
        {tokenList.map((item) => {
          return (
            <TokenSelector
              key={item.address}
              icon={''}
              token={item}
              onClick={() => onSelect(item)}
            />
          )
        })}
        {foundToken && !allTokensList[foundToken.address] && (
          <TokenSelector
            key={foundToken?.address}
            icon={''}
            token={foundToken}
            hasImport
          />
        )}
      </StyledList>
    </>
  )
}
