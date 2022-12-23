import { Button, CoinPair, Flex, Icon, Modal, Typography } from 'components'
import { FC, memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { borderRadius, colors, getTransparentColor } from 'styles'

import arrowDown_icon from 'assets/icons/arrow_blue.svg'
import farm_row_bg from 'assets/farms/row-bg.png'
import { AnimatePresence, motion } from 'framer-motion'
import { useModalRef, useStake, useUnstake } from 'hooks'
import { useTranslation } from 'react-i18next'
import { StakeLP } from '../StakeLP'
import { UnstakeLP } from '../UnstakeLP'
import {
  AprProps,
  EarnedProps,
  FarmProps,
  FarmWithStakedValue,
  LiquidityProps,
  MultiplierProps,
} from '../types.t'
import { aprToApy } from '../utils'
import { useFarmUser } from 'store'
import {
  getBalanceAmount,
  getBalanceNumber,
  getFullDisplayBalance,
} from 'utils'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

export interface IRowProps {
  apr: AprProps
  farm: FarmProps
  earned: EarnedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
}

const StyledRow = styled.tr<{ hasBorder: boolean }>`
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid
      ${({ hasBorder }) =>
        getTransparentColor(colors.black, hasBorder ? 0 : 0.05)};
  }
`

const StyledCell = styled.td<{ width: string }>`
  min-width: ${({ width }) => width};
`

const StyledName = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledTitle = styled(Typography.Small)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledButton = styled.button`
  margin: 10px 0;
  padding: 0 24px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius.primary};
  border: none;
  background-color: ${getTransparentColor(colors.black, 0.05)};
  transition: background-color 0.1s ease-in;

  &:hover {
    background-color: ${getTransparentColor(colors.black, 0.08)};
  }

  &:active {
    background-color: ${getTransparentColor(colors.black, 0.25)};
  }
`

const StyledButtonTitle = styled(Typography.BodyBold)`
  color: ${colors.lightBlue};
`

const StyledArrow = styled.img<{ isFlip: boolean }>`
  margin-left: 6px;
  width: 24px;
  height: 24px;
  transform: rotate(${({ isFlip }) => (isFlip ? -180 : 0)}deg);
  transition: transform 0.1s ease-in;
`

const StyledDetailedInfo = styled(motion.div)`
  height: 100%;
  width: 100%;
  padding: 0 30px;
  background-image: url(${farm_row_bg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`

const StyledDetailedTextGroup = styled(Flex)`
  flex-shrink: 0;
`

const StyledEnableFarm = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 0.4;

  &:before {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    background-color: ${getTransparentColor(colors.white, 0.5)};
    transform: skew(-10deg);
  }
`

const variants = {
  initial: { height: '0px', visibillity: 'hidden', opacity: 0 },
  animate: { height: '100px', visibillity: 'visible', opacity: 1 },
}

export const Row: FC<IRowProps> = memo((props) => {
  const { apr, farm, earned, multiplier, liquidity, details } = props
  const { pid } = farm
  const { allowance, tokenBalance, stakedBalance, earnings } = useFarmUser(pid)

  const { t } = useTranslation()
  const [isOpened, setOpened] = useState(false)
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const stakeModalRef = useModalRef()
  const unstakeModalRef = useModalRef()

  const handleOpenStake = () => {
    if (stakeModalRef.current) {
      stakeModalRef.current.open()
    }
  }

  const handleCloseStake = () => {
    if (stakeModalRef.current) {
      stakeModalRef.current.close()
    }
  }

  const handleOpenUnstake = () => {
    if (unstakeModalRef.current) {
      unstakeModalRef.current.open()
    }
  }

  const handleCloseUnstake = () => {
    if (unstakeModalRef.current) {
      unstakeModalRef.current.close()
    }
  }

  const hasFarm = details.userData?.stakedBalance

  const displayLiquidity = useMemo(
    () =>
      Number(liquidity.liquidity).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
    [liquidity.liquidity]
  )

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  return (
    <>
      <Modal title={t('Stake LP tokens')} ref={stakeModalRef}>
        <StakeLP onCancel={handleCloseStake} onConfirm={onStake} />
      </Modal>
      <Modal title={t('Unstake LP tokens')} ref={unstakeModalRef}>
        <UnstakeLP onCancel={handleCloseUnstake} onConfirm={onUnstake} />
      </Modal>
      <>
        <StyledRow
          hasBorder={isOpened}
          onClick={() => setOpened((prev) => !prev)}
        >
          <StyledCell width="54px">
            <CoinPair size="large" inputToken={'ETH'} outputToken={''} />
          </StyledCell>
          <StyledCell width="100px">
            <StyledName>{farm.label}</StyledName>
          </StyledCell>
          <StyledCell width="80px">
            <Flex flexDirection="column" alignItems="flex-start" gap="2px">
              <StyledTitle>APY</StyledTitle>
              <Typography.BodyBold>
                {apr.value ? `${aprToApy(apr.value.split(',')[0])}%` : '---'}
              </Typography.BodyBold>
            </Flex>
          </StyledCell>
          <StyledCell width="80px">
            <Flex flexDirection="column" alignItems="flex-start" gap="2px">
              <StyledTitle>APR</StyledTitle>
              <Typography.BodyBold>
                {apr.value
                  ? `${new BigNumber(apr.originalValue)
                      .div(DEFAULT_TOKEN_DECIMAL)
                      .toFixed(2)}%`
                  : '---'}
              </Typography.BodyBold>
            </Flex>
          </StyledCell>
          <StyledCell width="100px">
            <Flex flexDirection="column" alignItems="flex-start" gap="2px">
              <StyledTitle>Liquidity</StyledTitle>
              <Typography.BodyBold>
                {liquidity.liquidity ? displayLiquidity : '---'}
              </Typography.BodyBold>
            </Flex>
          </StyledCell>
          <StyledCell width="60px">
            <Flex flexDirection="column" alignItems="flex-start" gap="2px">
              <StyledTitle>Earned</StyledTitle>
              <Typography.BodyBold>
                {earned.earnings
                  ? `${earned.earnings.toLocaleString()}`
                  : '---'}
              </Typography.BodyBold>
            </Flex>
          </StyledCell>
          <StyledCell width="60px">
            <Flex flexDirection="column" alignItems="flex-start" gap="2px">
              <StyledTitle>Multipler</StyledTitle>
              <Typography.BodyBold>
                {multiplier.multiplier
                  ? multiplier.multiplier.toLowerCase()
                  : '---'}
              </Typography.BodyBold>
            </Flex>
          </StyledCell>
          <StyledCell width="100px">
            <Flex justifyContent="flex-end">
              <StyledButton onClick={() => {}}>
                <StyledButtonTitle>Details</StyledButtonTitle>
                <StyledArrow src={arrowDown_icon} isFlip={isOpened} />
              </StyledButton>
            </Flex>
          </StyledCell>
        </StyledRow>
      </>
      <tr>
        <td colSpan={8}>
          <AnimatePresence>
            {isOpened && (
              <StyledDetailedInfo
                variants={variants}
                initial="initial"
                animate="animate"
                exit="initial"
              >
                <Flex gap="10px" alignItems="center">
                  <Button onClick={() => {}}>Get LP</Button>
                  <StyledDetailedTextGroup flexDirection="column">
                    <StyledTitle>Avaliable LP</StyledTitle>
                    <Typography.BodyBold>
                      {/* {allowance && getBalanceAmount(allowance).toFixed()} */}
                    </Typography.BodyBold>
                  </StyledDetailedTextGroup>
                </Flex>
                <StyledEnableFarm>
                  {!hasFarm ? (
                    <Flex>
                      <Button onClick={() => {}}>Enable Farm</Button>
                    </Flex>
                  ) : (
                    <Flex
                      gap="8px"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Button onClick={handleOpenStake}>Stake</Button>
                      <Button onClick={handleOpenUnstake}>Unstake</Button>
                      <StyledDetailedTextGroup flexDirection="column">
                        <StyledTitle>Staked LP</StyledTitle>
                        <Typography.BodyBold>
                          {stakedBalance.gt(0) ? displayBalance() : '---'}
                        </Typography.BodyBold>
                      </StyledDetailedTextGroup>
                    </Flex>
                  )}
                </StyledEnableFarm>
                <Flex gap="10px" alignItems="center">
                  <Button onClick={() => {}}>Harvest</Button>
                  <StyledDetailedTextGroup flexDirection="column">
                    <StyledTitle>Earned</StyledTitle>
                    <Typography.BodyBold>
                      {earnings.gt(0)
                        ? `${getBalanceNumber(earnings).toFixed()}`
                        : '---'}
                    </Typography.BodyBold>
                  </StyledDetailedTextGroup>
                </Flex>
              </StyledDetailedInfo>
            )}
          </AnimatePresence>
        </td>
      </tr>
    </>
  )
})
