import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { translations, Language } from '@/i18n/translations'

interface I18nState {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: string) => {
        const { language } = get()
        const keys = key.split('.')
        let value: any = translations[language]

        for (const k of keys) {
          if (value && value[k]) {
            value = value[k]
          } else {
            return key // Fallback to key if not found
          }
        }

        return typeof value === 'string' ? value : key
      },
    }),
    {
      name: 'i18n-storage',
    }
  )
)
