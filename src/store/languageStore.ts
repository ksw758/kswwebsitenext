import { create } from 'zustand';
import { changeLanguage } from '../i18n';

type Language = 'ko' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: 'ko',
  setLanguage: (lang) => {
    changeLanguage(lang);
    set({ language: lang });
  },
  toggleLanguage: () => {
    const next = get().language === 'ko' ? 'en' : 'ko';
    changeLanguage(next);
    set({ language: next });
  },
}));
