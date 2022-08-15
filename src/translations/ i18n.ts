import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import TRANSLATIONS_EN from './en/en.json'
import { isDev } from 'utils'

const translations = {
  en: { translation: TRANSLATIONS_EN },
}

export const initI18n = () =>
  i18n.use(LanguageDetector).use(initReactI18next).init({
    resources: translations,
    debug: isDev,
    fallbackLng: 'en',
  })
