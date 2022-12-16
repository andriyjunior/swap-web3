import { FC, memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Currency, Token } from 'packages/swap-sdk'
import { borderRadius, colors, getTransparentColor } from 'styles'
import { Icon } from '../Icon'
import { Typography } from '../Typography'

import arrow_icon from 'assets/icons/arrow.svg'
import QUESTION_MARK_icon from 'assets/coins/QUESTION_MARK.png'
import { useAddUserToken, useCurrencyBalance, WrappedTokenInfo } from 'store'
import { Button } from '../Button'
import { useTranslation } from 'react-i18next'
import { getTokenUrlByAddress } from 'utils'
import { Coin } from '../Coin'
import { useActiveWeb3React } from 'hooks'

interface ITokenSelectorProps {
  hasArrow?: boolean
  token?: Token
  title?: string
  icon?: string
  onClick?: () => void
  onImport?: () => void
  onRemove?: () => void
}

const StyledRoot = styled.button`
  padding: 5px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  border-radius: ${borderRadius.primary};
  transition: background-color 0.1s ease-in;

  &:hover {
    background-color: ${getTransparentColor(colors.black, 0.05)};
  }
`

const StyledBody = styled.div`
  width: 100%;
  min-width: 0;
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const StyledCoinIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

const StyledLeft = styled.div``

const StyledText = styled(Typography.BodyBold)`
  padding: 0 5px;
`

const StyledBalance = styled(Typography.BodyBold)`
  opacity: 0.5;
`

const StyledArrowIcon = styled(Icon)`
  display: flex;
  opacity: 0.5;
  transition: opacity 0.1s ease-in;
  flex-shrink: 1;

  &:hover {
    opacity: 1;
  }
`

const StyledImportButton = styled.div`
  min-width: 134px;
`

export const TokenSelector: FC<ITokenSelectorProps> = memo(
  ({ icon, onClick, hasArrow, token, title, onImport, onRemove }) => {
    const { account } = useActiveWeb3React()
    const { t } = useTranslation()

    const balance = useCurrencyBalance(account || undefined, token)

    const imgUrl = icon
      ? icon
      : token instanceof WrappedTokenInfo
      ? token?.logoURI
      : token?.address
      ? getTokenUrlByAddress(token.address)
      : getTokenUrlByAddress(token?.symbol)

    return (
      <StyledRoot onClick={onClick}>
        {<Coin src={imgUrl ?? ''} width={'small'} />}
        <StyledBody>
          <StyledText>{title || token?.symbol || 'ETH'}</StyledText>
          {!onImport && !onRemove && balance && (
            <StyledBalance>{balance.toSignificant(6)}</StyledBalance>
          )}
          {hasArrow && <StyledArrowIcon src={arrow_icon} />}
          {onImport && (
            <StyledImportButton>
              <Button title={t('importToken')} onClick={onImport} />
            </StyledImportButton>
          )}
          {onRemove && (
            <StyledImportButton>
              <Button title={t('removeToken')} onClick={onRemove} />
            </StyledImportButton>
          )}
        </StyledBody>
      </StyledRoot>
    )
  }
)
