import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { korean } from './locales/korean';
import { english } from './locales/english';

const resources = {
  ko: { translation: korean },
  en: { translation: english },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ko',
      fallbackLng: 'ko',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
}

export default i18n;

export const changeLanguage = (language: 'ko' | 'en') => {
  i18n.changeLanguage(language);
};

export const getCurrentLanguage = (): 'ko' | 'en' => {
  return i18n.language as 'ko' | 'en';
};
