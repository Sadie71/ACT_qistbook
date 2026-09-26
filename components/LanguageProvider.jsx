'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations, createTranslateFunction } from '@/lib/i18n';

const defaultT = createTranslateFunction('ur');

const LanguageContext = createContext({
  lang: 'ur',
  setLang: () => {},
  t: defaultT,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('ur');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('qistbook_lang');
      if (saved && (saved === 'ur' || saved === 'en')) {
        setLangState(saved);
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('qistbook_lang', newLang);
    } catch (e) {
      // ignore
    }
  };

  const t = useMemo(() => createTranslateFunction(lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
