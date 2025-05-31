
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {},
  ar: {},
};

async function loadTranslations(lang: Language) {
  if (Object.keys(translations[lang]).length === 0) {
    const module = await import(`@/locales/${lang}.json`);
    translations[lang] = module.default;
  }
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedLang = localStorage.getItem('fridgeChefLanguage') as Language | null;
    const initialLang = storedLang || 'en';
    
    async function initLang() {
      setIsLoading(true); // Ensure loading state during async operations
      await loadTranslations(initialLang);
      // If the initial language is not English, also ensure English translations are loaded for fallbacks.
      if (initialLang !== 'en' && Object.keys(translations['en']).length === 0) {
        await loadTranslations('en');
      }
      
      setLanguageState(initialLang);
      setDirection(initialLang === 'ar' ? 'rtl' : 'ltr');
      if (typeof window !== 'undefined') {
        document.documentElement.lang = initialLang;
        document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
      }
      setIsLoading(false);
    }
    initLang();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setIsLoading(true);
    await loadTranslations(lang);
    setLanguageState(lang);
    const newDirection = lang === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    localStorage.setItem('fridgeChefLanguage', lang);
    if (typeof window !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = newDirection;
    }
    setIsLoading(false);
  }, []);

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    if (isLoading || !translations[language]) {
      // During SSR or initial client load before translations are ready,
      // or if translations for the current language are somehow missing after load.
      // Attempt to use English fallbacks if `translations['en']` is populated.
      const englishTranslationAttempt = translations['en']?.[key];
      if (englishTranslationAttempt) {
        let fallbackStr = englishTranslationAttempt;
        if (replacements) {
          Object.keys(replacements).forEach((placeholder) => {
            fallbackStr = fallbackStr.replace(new RegExp(`{${placeholder}}`, 'g'), String(replacements[placeholder]));
          });
        }
        return fallbackStr;
      }
      return key; // Fallback to key if no translations available
    }

    let translation = translations[language][key] || translations['en'][key] || key;
    if (replacements) {
      Object.keys(replacements).forEach((placeholder) => {
        translation = translation.replace(
          new RegExp(`{${placeholder}}`, 'g'),
          String(replacements[placeholder])
        );
      });
    }
    return translation;
  }, [language, isLoading]);

  // Removed the conditional block that returned children without the provider:
  // if (isLoading && Object.keys(translations[language]).length === 0) {
  // return <div lang="en" dir="ltr">{children}</div>;
  // }
  // Now, LanguageContext.Provider is always rendered.

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

    