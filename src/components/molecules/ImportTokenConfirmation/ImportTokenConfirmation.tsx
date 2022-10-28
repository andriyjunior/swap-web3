import { Button, Flex, HorizontalSeparator, Typography } from 'components/atoms'
import { etherscan } from 'const'
import { useActiveWeb3React } from 'hooks'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { borderRadius, colors, getTransparentColor } from 'styles'
import { truncateHash } from 'utils'

interface IImportTokenConfirmationProps {
  onImport: () => void
  address: string
  symbol: string
}

const StyledRoot = styled.div``

const StyledDesc = styled(Typography.Body)`
  color: ${colors.error};
`

const StyledAbout = styled(Flex)`
  margin: 24px 0;
  justify-content: space-between;
`

const StyledLink = styled.a`
  color: ${colors.lightBlue};
`

const StyledTokenAbout = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

const StyledFooter = styled(Flex)`
  justify-content: space-between;
`

const StyledCheckbox = styled.div`
  display: flex;
  align-items: center;
  width: 400px;
`
const StyledCheckboxButton = styled.button<{ isSelected: boolean }>`
  position: relative;
  border: 1px solid ${getTransparentColor(colors.black, 0.05)};
  border-radius: ${borderRadius.primary};
  width: 24px;
  height: 24px;
  background-color: transparent;

  &::after {
    position: absolute;
    content: '';
    top: 0px;
    left: 0px;
    width: 15px;
    height: 15px;
    border-radius: 4px;
    transition: background-color 0.1s ease-in;
    background-color: ${({ isSelected }) =>
      isSelected ? colors.lightBlue : 'transparent'};

    transform: translateX(25%) translateY(25%);
  }
`

const StyledLabel = styled(Typography.Button)`
  padding-left: 10px;
`

export const ImportTokenConfirmation: FC<IImportTokenConfirmationProps> = ({
  onImport,
  symbol,
  address,
}) => {
  const [isSelected, setSelected] = useState(false)
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <StyledRoot>
      <StyledDesc>
        Anyone can create a BEB20 token on BNB Smart Chain with any name,
        including creating fake versions of existing tokens and tokens that
        claim to represent projects that do not have token.
        <br />
        <br /> If you purchase an arbitiary token, you may be unable to sell it
        back.
      </StyledDesc>
      <HorizontalSeparator />
      <StyledAbout>
        <Flex flexDirection="column" justifyContent="flex-start">
          <StyledTokenAbout>My Future Token ({symbol})</StyledTokenAbout>
          <StyledTokenAbout>{truncateHash(address)}</StyledTokenAbout>
        </Flex>
        <StyledLink
          href={`${etherscan[chainId]}token/${address}`}
          target={'_blank'}
        >
          Viev on Etherscan
        </StyledLink>
      </StyledAbout>
      <StyledFooter>
        <StyledCheckbox>
          <StyledCheckboxButton
            autoFocus
            isSelected={isSelected}
            onClick={() => setSelected((prev) => !prev)}
          />
          <StyledLabel>I understand</StyledLabel>
        </StyledCheckbox>
        <Button onClick={() => (isSelected ? onImport() : () => {})}>
          {t('importToken')}
        </Button>
      </StyledFooter>
    </StyledRoot>
  )
}
