import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { InnerContainer, Input, Typography } from 'components'

interface ISelectTokenProps {
  children?: ReactNode
}

export const SelectToken: FC<ISelectTokenProps> = () => {
  const { t } = useTranslation()

  return (
    <>
      <Input
        value={''}
        onInput={() => {}}
        placeholder={t('selectToken.searchByNameOrPasteAdress')}
      />
      <Typography.Title>{t('selectToken.tokenName')}</Typography.Title>
      <InnerContainer>List of tokens</InnerContainer>
    </>
  )
}
