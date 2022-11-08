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

const StyledArrow = styled.img`
  width: 24px;
  height: 24px;
`

const StyledDetailedInfo = styled(motion.div)`
  padding: 30px;
  background-image: url(${farm_row_bg});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
`

const variants = {
  initial: { height: '0px', visibillity: 'hidden', opacity: 0 },
  animate: { height: '100px', visibillity: 'visible', opacity: 1 },
}

export const Row: FC = () => {
  const [isOpened, setOpened] = useState(false)
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
            <StyledButton onClick={() => setOpened((prev) => !prev)}>
              <StyledButtonTitle>Details</StyledButtonTitle>
              <StyledArrow src={arrowDown_icon} />
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
                <Flex>
                  <div>
                    <Button onClick={() => {}}>Get LP</Button>
                  </div>
                  <div>
                    <Button onClick={() => {}}>Enable Farm</Button>
                  </div>
                  <div>
                    <Button onClick={() => {}}>Harvest</Button>
                  </div>
                </Flex>
              </StyledDetailedInfo>
            )}
          </AnimatePresence>
        </td>
      </tr>
    </>
  )
}
