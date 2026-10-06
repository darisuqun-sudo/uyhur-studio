'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Theme, HistoryItem, FeatureCategory } from '../types';
import { ug } from '../locales/ug';
import { en } from '../locales/en';
import { DEFAULT_SELECTED_MODELS } from '../lib/constants';

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  openRouterApiKey: string;
  setOpenRouterApiKey: (key: string) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  selectedModels: Record<FeatureCategory, string>;
  setModelForCategory: (category: FeatureCategory, modelId: string) => void;
  applyGemini38FlashToAll: () => void;
  customModels: Record<FeatureCategory, string>;
  setCustomModelForCategory: (category: FeatureCategory, modelId: string) => void;
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
  t: typeof ug;
  isMounted: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ug');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [openRouterApiKey, setOpenRouterApiKeyState] = useState<string>('');
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>('');
  const [selectedModels, setSelectedModelsState] = useState<Record<FeatureCategory, string>>(DEFAULT_SELECTED_MODELS);
  const [customModels, setCustomModelsState] = useState<Record<FeatureCategory, string>>({
    chat: '',
    translate: '',
    image: '',
    tts: '',
    video: '',
    ocr: '',
    writer: '',
    stt: '',
    marketing: '',
  });
  const [history, setHistoryState] = useState<HistoryItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLang = localStorage.getItem('app_language') as Language;
      if (savedLang && (savedLang === 'ug' || savedLang === 'en')) {
        setLanguageState(savedLang);
      }

      const savedTheme = localStorage.getItem('app_theme') as Theme;
      if (savedTheme) {
        setThemeState(savedTheme);
      }

      const savedOpenRouterKey = localStorage.getItem('app_openrouter_key');
      if (savedOpenRouterKey) setOpenRouterApiKeyState(savedOpenRouterKey);

      const savedGeminiKey = localStorage.getItem('app_gemini_key');
      if (savedGeminiKey) setGeminiApiKeyState(savedGeminiKey);

      const savedModels = localStorage.getItem('app_selected_models');
      const modelVersion = localStorage.getItem('app_model_version');

      if (savedModels && modelVersion === '3.8-expanded') {
        setSelectedModelsState({ ...DEFAULT_SELECTED_MODELS, ...JSON.parse(savedModels) });
      } else {
        setSelectedModelsState(DEFAULT_SELECTED_MODELS);
        localStorage.setItem('app_selected_models', JSON.stringify(DEFAULT_SELECTED_MODELS));
        localStorage.setItem('app_model_version', '3.8-expanded');
      }

      const savedCustomModels = localStorage.getItem('app_custom_models');
      if (savedCustomModels) {
        setCustomModelsState({ ...customModels, ...JSON.parse(savedCustomModels) });
      }

      const savedHistory = localStorage.getItem('app_history');
      if (savedHistory) {
        setHistoryState(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ug' ? 'rtl' : 'ltr';
    if (language === 'ug') {
      document.body.classList.add('font-uyghur');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-uyghur');
    }
  }, [language, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, isMounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_language', lang);
    } catch {}
  };

  const setTheme = (th: Theme) => {
    setThemeState(th);
    try {
      localStorage.setItem('app_theme', th);
    } catch {}
  };

  const setOpenRouterApiKey = (key: string) => {
    setOpenRouterApiKeyState(key);
    try {
      localStorage.setItem('app_openrouter_key', key);
    } catch {}
  };

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    try {
      localStorage.setItem('app_gemini_key', key);
    } catch {}
  };

  const setModelForCategory = (category: FeatureCategory, modelId: string) => {
    setSelectedModelsState((prev) => {
      const updated = { ...prev, [category]: modelId };
      try {
        localStorage.setItem('app_selected_models', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const applyGemini38FlashToAll = () => {
    const allGemini38: Record<FeatureCategory, string> = {
      chat: 'google/gemini-3.8-flash',
      translate: 'google/gemini-3.8-flash',
      image: 'google/gemini-3.8-flash',
      tts: 'google/gemini-3.8-flash',
      video: 'google/gemini-3.8-flash',
      ocr: 'google/gemini-3.8-flash',
      writer: 'google/gemini-3.8-flash',
      stt: 'google/gemini-3.8-flash',
      marketing: 'google/gemini-3.8-flash',
    };
    const clearedCustom: Record<FeatureCategory, string> = {
      chat: '',
      translate: '',
      image: '',
      tts: '',
      video: '',
      ocr: '',
      writer: '',
      stt: '',
      marketing: '',
    };
    setSelectedModelsState(allGemini38);
    setCustomModelsState(clearedCustom);
    try {
      localStorage.setItem('app_selected_models', JSON.stringify(allGemini38));
      localStorage.setItem('app_custom_models', JSON.stringify(clearedCustom));
      localStorage.setItem('app_model_version', '3.8-expanded');
    } catch {}
  };

  const setCustomModelForCategory = (category: FeatureCategory, modelId: string) => {
    setCustomModelsState((prev) => {
      const updated = { ...prev, [category]: modelId };
      try {
        localStorage.setItem('app_custom_models', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setHistoryState((prev) => {
      const updated = [newItem, ...prev].slice(0, 100);
      try {
        localStorage.setItem('app_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeHistoryItem = (id: string) => {
    setHistoryState((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('app_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    setHistoryState([]);
    try {
      localStorage.removeItem('app_history');
    } catch {}
  };

  const t = language === 'ug' ? ug : en;

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        openRouterApiKey,
        setOpenRouterApiKey,
        geminiApiKey,
        setGeminiApiKey,
        selectedModels,
        setModelForCategory,
        applyGemini38FlashToAll,
        customModels,
        setCustomModelForCategory,
        history,
        addHistory,
        removeHistoryItem,
        clearHistory,
        t,
        isMounted,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
