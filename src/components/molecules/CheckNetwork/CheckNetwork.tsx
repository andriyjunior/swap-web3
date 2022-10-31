import { ChainId } from 'packages/swap-sdk'
import {
  useActiveWeb3React,
  useAuth,
  useModalRef,
  useSwitchNetwork,
} from 'hooks'
import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button, Modal, SimpleButton, Typography } from 'components/atoms'

import error_icon from 'assets/error.png'
import { colors } from 'styles'
import { useTranslation } from 'react-i18next'

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledImg = styled.img``

const StyledDesc = styled(Typography.Body)`
  color: ${colors.lightBlue};
  width: 350px;
`

const StyledButtons = styled.div`
  padding-top: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const supportedChains = [ChainId.TESTNET]

export const CheckNetwork: FC = () => {
  const { t } = useTranslation()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { logOut } = useAuth()

  const modalRef = useModalRef()

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum?.on('chainChanged', (chainId) => {
        if (!supportedChains.some((item) => Number(chainId) === item)) {
          modalRef.current?.open()
        } else {
          modalRef.current?.close()
        }
      })
    }
  }, [])

  const handleDisconnect = () => {
    logOut()
    if (modalRef.current) {
      modalRef.current.close()
    }
  }

  return (
    <Modal ref={modalRef} title={'Check your network'} onClose={() => logOut()}>
      <StyledRoot>
        <StyledImg src={error_icon} />

        <StyledDesc>
          {t(
            'Currently this page only supported in Ethereum Please change your network to continue'
          )}
        </StyledDesc>
        <StyledButtons>
          <SimpleButton onClick={() => switchNetworkAsync(ChainId.TESTNET)}>
            {t('switchNetwork')}
          </SimpleButton>
          <Button onClick={handleDisconnect}>{t('userBar.disconnect')}</Button>
        </StyledButtons>
      </StyledRoot>
    </Modal>
  )
}
