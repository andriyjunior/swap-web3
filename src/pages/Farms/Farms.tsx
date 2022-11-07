import { Container, Flex, Typography } from 'components'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { breakpoints } from 'styles'
import { FilterBar } from './parts'

interface IFarmsProps {
  children?: ReactNode
}

const StyledPage = styled(Container)``

const StyledTitle = styled(Typography.Header4)``

export const Farms: FC<IFarmsProps> = () => {
  const { t } = useTranslation()

  return (
    <StyledPage>
      <StyledTitle>{t('Swap tokens')}</StyledTitle>
      <FilterBar />
    </StyledPage>
  )
}
