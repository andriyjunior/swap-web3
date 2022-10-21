import { FC, memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Currency, Token } from 'packages/swap-sdk'
import { borderRadius, colors, getTransparentColor } from 'styles'
import { Icon } from '../Icon'
import { Typography } from '../Typography'

import arrow_icon from 'assets/icons/arrow.svg'
import QUESTION_MARK_icon from 'assets/coins/QUESTION_MARK.png'
import { useAddUserToken } from 'store'
import { Button } from '../Button'
import { useTranslation } from 'react-i18next'

interface ITokenSelectorProps {
  hasArrow?: boolean
  token?: Token | Currency
  title?: string
  icon?: string
  onClick?: () => void
  onImport?: () => void
  onRemove?: () => void
}

const StyledRoot = styled.button`
  padding: 5px;
  min-width: 0;
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
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const StyledCoinIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

const StyledText = styled(Typography.BodyBold)`
  padding: 0 5px;
`

const StyledArrowIcon = styled(Icon)`
  opacity: 0.5;
  transition: opacity 0.1s ease-in;

  &:hover {
    opacity: 1;
  }
`

const StyledImportButton = styled.div`
  min-width: 134px;
`

export const TokenSelector: FC<ITokenSelectorProps> = memo(
  ({ icon, onClick, hasArrow, token, title, onImport, onRemove }) => {
    const [imgError, setImgError] = useState(false)

    const { t } = useTranslation()

    useEffect(() => {
      setImgError(false)
    }, [icon])

    return (
      <StyledRoot onClick={onClick}>
        <StyledCoinIcon
          onError={() => setImgError(true)}
          loading="lazy"
          src={imgError ? QUESTION_MARK_icon : icon}
        />
        <StyledBody>
          <StyledText>{title || token?.symbol || 'ETH'}</StyledText>
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
