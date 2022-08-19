import { FC, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InnerContainer, Input, TokenSelector, Typography } from 'components'
import styled from 'styled-components'

import allTokenList from 'const/token-list.json'

interface ISelectTokenProps {
  children?: ReactNode
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  onSelect: (value: any) => void
}

const StyledList = styled(InnerContainer)`
  padding: 12px 10px;
  height: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
`

export const SelectToken: FC<ISelectTokenProps> = ({ onSelect }) => {
  const [tokenList, setTokenList] = useState(allTokenList.tokens)
  const [input, setInput] = useState('')

  const { t } = useTranslation()

  useEffect(() => {
    const filteredTokens = allTokenList.tokens.filter((item) =>
      item.symbol.toLowerCase().includes(input.toLowerCase())
    )

    setTokenList(filteredTokens || allTokenList.tokens)
  }, [input])

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
              icon={item.logoURI}
              title={item.symbol}
              onClick={() => onSelect(item)}
            />
          )
        })}
      </StyledList>
    </>
  )
}
