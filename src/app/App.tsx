import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from './ErrorBoundary'

export const App: FC = () => {
  const { t } = useTranslation()
  return (
    <ErrorBoundary>
      <div>Welcome to Sevn Finance</div>
      <div>{t('welcome')}</div>
    </ErrorBoundary>
  )
}
