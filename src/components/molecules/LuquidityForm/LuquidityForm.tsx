import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Typography,
  Modal,
  Settings,
  Accordion,
  CoinPair,
  AddLiquidity,
  RemoveLiquidity,
} from 'components'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { useLiquidityForm } from './hooks'

import { colors, getTransparentColor } from 'styles'

import { useModalRef } from 'hooks'

const StyledPairTitle = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

// interface ISwapProps {}

enum TabEnum {
  Add,
  Remove,
}

export const LuquidityForm: FC = () => {
  const [currentTab, setCurrentTab] = useState(TabEnum.Add)

  const { t } = useTranslation()

  const settingsModalRef = useModalRef()

  const { state } = useLiquidityForm()

  const tabs = {
    [TabEnum.Add]: <AddLiquidity settingsRef={settingsModalRef} />,
    [TabEnum.Remove]: <RemoveLiquidity />,
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Modal ref={settingsModalRef} title={t('settings')}>
          <Settings />
        </Modal>

        {tabs[currentTab]}

        <Typography.Title>{t('liquidityForm.yourLiquidity')}</Typography.Title>
        <Accordion
          hasArrow
          element={
            <Flex alignItems="center">
              <CoinPair
                inputToken={state.inputToken.logoURI}
                outputToken={state.outputToken.logoURI}
              />
              <StyledPairTitle>
                {state.inputToken.symbol}/{state.outputToken.symbol}
              </StyledPairTitle>
            </Flex>
          }
        >
          Content
        </Accordion>
        <Accordion
          hasArrow
          element={
            <Flex alignItems="center">
              <CoinPair
                inputToken={state.inputToken.logoURI}
                outputToken={state.outputToken.logoURI}
              />
              <StyledPairTitle>
                {state.inputToken.symbol}/{state.outputToken.symbol}
              </StyledPairTitle>
            </Flex>
          }
        >
          Content
        </Accordion>
      </motion.div>
    </AnimatePresence>
  )
}
