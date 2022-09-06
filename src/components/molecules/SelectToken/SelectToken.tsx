import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InnerContainer, Input, TokenSelector, Typography } from 'components'
import styled from 'styled-components'
import { TokenDTO } from 'types'
import { colors, getTransparentColor } from 'styles'

interface ISelectTokenProps {
  onSelect: (value: TokenDTO) => void
  allTokensList: TokenDTO[]
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

export const SelectToken: FC<ISelectTokenProps> = ({
  onSelect,
  allTokensList,
}) => {
  const [tokenList, setTokenList] = useState<TokenDTO[]>(allTokensList)
  const [input, setInput] = useState('')

  const { t } = useTranslation()

  useEffect(() => {
    const filteredTokens = allTokensList.filter((item) =>
      item.symbol.toLowerCase().includes(input.toLowerCase())
    )

    setTokenList(filteredTokens || allTokensList)
  }, [input, allTokensList])

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
