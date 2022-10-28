import {
  Flex,
  ImportTokenConfirmation,
  InnerContainer,
  Input,
  Modal,
  TokenSelector,
  Typography,
} from 'components'
import { FC, ReactNode, useState } from 'react'

import icon_arrow from 'assets/icons/back-arrow.svg'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  useActiveWeb3React,
  useAllTokens,
  useDebounce,
  useModalRef,
  useToast,
  useToken,
} from 'hooks'
import { useAddUserToken, useRemoveUserAddedToken } from 'store'
import { getTokenUrlByAddress, truncateHash } from 'utils'

import QUESTION_MARK_icon from 'assets/coins/QUESTION_MARK.png'
import { getTransparentColor, colors } from 'styles'
import useUserAddedTokens from 'store/features/user/hooks/useUserAddedTokens'

const StyledArrowButton = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
`
const StyledArrowIcon = styled.img`
  padding-right: 4px;
  margin: 10px 0;
`

const StyledGoBack = styled(Flex)`
  margin-bottom: 16px;
`

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

interface IManageTokensProps {
  goBack: () => void
}

export const ManageTokens: FC<IManageTokensProps> = ({ goBack }) => {
  const { chainId } = useActiveWeb3React()
  const [input, setInput] = useState('')
  const debouncedQuery = useDebounce(input, 200)
  const allTokensList = useAllTokens()

  const userTokens = useUserAddedTokens()

  const foundToken = useToken(debouncedQuery)
  const addToken = useAddUserToken()
  const removeToken = useRemoveUserAddedToken()

  const { toastSuccess } = useToast()

  const { t } = useTranslation()

  const modalRef = useModalRef()

  const handleAddToken = () => {
    if (foundToken) {
      addToken(foundToken)
      toastSuccess('Successfully added', truncateHash(foundToken.address))
      goBack()
    }
  }

  const handleRemoveToken = (token) => {
    if (chainId) {
      toastSuccess('Successfully removed', truncateHash(token.address))
      removeToken(chainId, token.address)
    }
  }

  const handleImport = () => {
    handleAddToken()

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
      <StyledGoBack alignItems="center">
        <StyledArrowButton onClick={goBack}>
          <StyledArrowIcon src={icon_arrow} />
          <Typography.Body>{t('goBack')}</Typography.Body>
        </StyledArrowButton>
      </StyledGoBack>
      <Input
        value={input}
        onInput={setInput}
        placeholder={t('selectToken.searchByNameOrPasteAdress')}
      />
      <Typography.Title>{t('selectToken.tokenName')}</Typography.Title>
      <StyledList>
        {foundToken && !allTokensList[foundToken.address] && (
          <TokenSelector
            key={foundToken?.address}
            icon={
              getTokenUrlByAddress(foundToken.address) || QUESTION_MARK_icon
            }
            token={foundToken}
            onImport={() => modalRef.current?.open()}
          />
        )}
        {userTokens.map((item) => {
          return (
            <TokenSelector
              key={item.address}
              icon={getTokenUrlByAddress(item.address) || QUESTION_MARK_icon}
              token={item}
              onRemove={() => handleRemoveToken(item)}
            />
          )
        })}
      </StyledList>
    </>
  )
}
