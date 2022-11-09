import { Button, CoinPair, Flex, Icon, Typography } from 'components'
import { FC, useState } from 'react'
import styled from 'styled-components'
import { borderRadius, colors, getTransparentColor } from 'styles'

import arrowDown_icon from 'assets/icons/arrow_blue.svg'
import farm_row_bg from 'assets/farms/row-bg.png'
import { AnimatePresence, motion } from 'framer-motion'

// interface IRowProps {}

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
  width: 24px;
  height: 24px;
  transform: rotate(${({ isFlip }) => (isFlip ? 180 : 0)}deg);
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

export const Row: FC = () => {
  const [isOpened, setOpened] = useState(false)

  const hasFarm = true
  return (
    <>
      <>
        <StyledRow
          hasBorder={isOpened}
          onClick={() => setOpened((prev) => !prev)}
        >
          <StyledCell width="54px">
            <CoinPair size="large" inputToken={'ETH'} outputToken={''} />
          </StyledCell>
          <StyledCell width="100px">
            <StyledName>SEVN/ETH</StyledName>
          </StyledCell>
          <StyledCell width="80px">
            <Flex flexDirection="column" alignItems="flex-start" gap="2px">
              <StyledTitle>APY</StyledTitle>
              <Typography.BodyBold>50.09%</Typography.BodyBold>
            </Flex>
          </StyledCell>
          <StyledCell width="80px">
            <Flex flexDirection="column" alignItems="flex-start" gap="2px">
              <StyledTitle>APR</StyledTitle>
              <Typography.BodyBold>40.60%</Typography.BodyBold>
            </Flex>
          </StyledCell>
          <StyledCell width="100px">
            <Flex flexDirection="column" alignItems="flex-start" gap="2px">
              <StyledTitle>Liquidity</StyledTitle>
              <Typography.BodyBold>$9 224 833</Typography.BodyBold>
            </Flex>
          </StyledCell>
          <StyledCell width="60px">
            <Flex flexDirection="column" alignItems="flex-start" gap="2px">
              <StyledTitle>Earned</StyledTitle>
              <Typography.BodyBold>---</Typography.BodyBold>
            </Flex>
          </StyledCell>
          <StyledCell width="60px">
            <Flex flexDirection="column" alignItems="flex-start" gap="2px">
              <StyledTitle>Multipler</StyledTitle>
              <Typography.BodyBold>50X</Typography.BodyBold>
            </Flex>
          </StyledCell>
          <StyledCell width="100px">
            <StyledButton onClick={() => {}}>
              <StyledButtonTitle>Details</StyledButtonTitle>
              <StyledArrow src={arrowDown_icon} isFlip={isOpened} />
            </StyledButton>
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
                    <Typography.BodyBold>0.0345 LP</Typography.BodyBold>
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
                      <Button onClick={() => {}}>Stake</Button>
                      <Button onClick={() => {}}>Unstake</Button>
                      <StyledDetailedTextGroup flexDirection="column">
                        <StyledTitle>Avaliable LP</StyledTitle>
                        <Typography.BodyBold>0.0345 LP</Typography.BodyBold>
                      </StyledDetailedTextGroup>
                    </Flex>
                  )}
                </StyledEnableFarm>
                <Flex gap="10px" alignItems="center">
                  <Button onClick={() => {}}>Harvest</Button>
                  <StyledDetailedTextGroup flexDirection="column">
                    <StyledTitle>Earned</StyledTitle>
                    <Typography.BodyBold>0.0345 SEVN</Typography.BodyBold>
                  </StyledDetailedTextGroup>
                </Flex>
              </StyledDetailedInfo>
            )}
          </AnimatePresence>
        </td>
      </tr>
    </>
  )
}
