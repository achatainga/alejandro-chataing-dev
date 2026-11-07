import { useState, useEffect } from 'react'
import type { Language } from '../types/client.types'

const LANG_STORAGE_KEY = 'alejandro_portfolio_lang'

export function useLang() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    const urlParam = new URLSearchParams(window.location.search).get('lang')
    if (urlParam === 'es' || urlParam === 'en') return urlParam
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
    const browserLang = navigator.language.slice(0, 2)
    return browserLang === 'es' ? 'es' : 'en'
  })

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'es' : 'en'))

  return { lang, setLang, toggleLang }
}
