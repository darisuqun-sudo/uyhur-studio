'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  ChevronDown,
  Image as ImageIcon,
  Languages,
  Mic,
  Video,
  MessageSquare,
  History,
  Settings,
  ScanText,
  PenTool,
  Megaphone,
  Radio,
  Moon,
  Sun,
  Menu,
  X,
  Globe,
  Compass,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, theme, setTheme, t } = useSettings();
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const toolCategories = [
    {
      title: t.categoryVisual,
      color: 'text-pink-500 dark:text-pink-400',
      bgColor: 'bg-pink-500/10 border-pink-500/20',
      items: [
        {
          href: '/image',
          label: t.navImage,
          desc: 'سەنئەت ۋە فوتو ھاسىللاش',
          icon: ImageIcon,
          color: 'text-pink-500',
        },
        {
          href: '/ad-video',
          label: t.navVideo,
          desc: 'ئادەمسىز سىن فىلىمى سېنارىيەسى',
          icon: Video,
          color: 'text-purple-500',
        },
        {
          href: '/ocr',
          label: t.navOcr,
          desc: 'سۈرەت ۋە پۈتۈكتىن تېكىست ئېلىش',
          icon: ScanText,
          color: 'text-indigo-500',
        },
      ],
    },
    {
      title: t.categoryLanguage,
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      items: [
        {
          href: '/translate',
          label: t.navTranslate,
          desc: 'ئۇيغۇرچە ۋە كۆپ تىللىق كەسپىي تەرجىمە',
          icon: Languages,
          color: 'text-blue-500',
        },
        {
          href: '/writer',
          label: t.navWriter,
          desc: 'ئىملا تۈزىتىش، ماقالە ۋە ئۇسلۇب',
          icon: PenTool,
          color: 'text-fuchsia-500',
        },
        {
          href: '/marketing',
          label: t.navMarketing,
          desc: 'TikTok, Instagram ۋە ئىلان سۆزلىرى',
          icon: Megaphone,
          color: 'text-amber-500',
        },
      ],
    },
    {
      title: t.categoryVoice,
      color: 'text-rose-500 dark:text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      items: [
        {
          href: '/stt',
          label: t.navStt,
          desc: 'سۆزلەنگەن ئاۋازنى يېزىققا ئايلاندۇرۇش',
          icon: Radio,
          color: 'text-rose-500',
        },
        {
          href: '/tts',
          label: t.navTts,
          desc: 'تەبىئىي ئاۋاز بىلەن تېكىست ئوقۇش',
          icon: Mic,
          color: 'text-amber-500',
        },
        {
          href: '/chat',
          label: t.navChat,
          desc: 'كۆپ روللۇق ئەقلىي پاراڭچى بوت',
          icon: MessageSquare,
          color: 'text-emerald-500',
        },
      ],
    },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'ug' ? 'en' : 'ug');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isToolActive = [
    '/image',
    '/translate',
    '/ocr',
    '/writer',
    '/marketing',
    '/stt',
    '/tts',
    '/ad-video',
  ].includes(pathname);

  return (
    <nav className="sticky top-0 z-50 w-full glass-nav bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition transform ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition tracking-tight">
                  {t.brandTitle}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  AI
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500 leading-none">
                {t.brandSubtitle}
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Menu (Clean & Uncluttered) */}
          <div className="hidden md:flex items-center gap-1.5">
            {/* Home Link */}
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                pathname === '/'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <span>{t.navHome}</span>
            </Link>

            {/* AI Tools Mega Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition group ${
                  isToolActive || toolsDropdownOpen
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.navTools}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    toolsDropdownOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Mega Dropdown Panel */}
              {toolsDropdownOpen && (
                <div
                  className={`absolute top-full mt-2 w-[600px] lg:w-[680px] p-5 rounded-3xl z-50 ${
                    theme === 'dark' ? 'glass-dropdown' : 'glass-dropdown-light'
                  } ${language === 'ug' ? 'right-0' : 'left-0'} animate-in fade-in zoom-in-95 duration-150`}
                >
                  <div className="grid grid-cols-3 gap-5">
                    {toolCategories.map((cat, idx) => (
                      <div key={idx} className="space-y-2.5">
                        <div className="flex items-center gap-1.5 px-2 pb-1 border-b border-slate-200/60 dark:border-slate-800/80">
                          <span className={`text-[11px] font-bold ${cat.color}`}>
                            {cat.title}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {cat.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setToolsDropdownOpen(false)}
                                className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition ${
                                  isActive
                                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 mt-0.5 ${item.color}`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-xs leading-tight">
                                    {item.label}
                                  </div>
                                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                    {item.desc}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dropdown Footer Quick Link */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px]">Google Gemini 3.8 Flash & OpenRouter ماتورى</span>
                    <Link
                      href="/settings"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>مودېل ۋە API تەڭشىكى</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Quick Link: Translation */}
            <Link
              href="/translate"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                pathname === '/translate'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-blue-500" />
              <span>{t.navTranslate}</span>
            </Link>

            {/* Direct Quick Link: Chat */}
            <Link
              href="/chat"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                pathname === '/chat'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.navChat}</span>
            </Link>

            {/* Direct Quick Link: History */}
            <Link
              href="/history"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                pathname === '/history'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.navHistory}</span>
            </Link>
          </div>

          {/* 3. Utility Actions (Language, Theme, Settings, Mobile Button) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Switch Language / تىل ئالماشتۇرۇش"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'ug' ? 'EN' : 'ئۇيغۇرچە'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition shadow-sm"
              title="تېما ئالماشتۇرۇش (Theme)"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Settings Link */}
            <Link
              href="/settings"
              className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition shadow-sm ${
                pathname === '/settings'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/40'
                  : ''
              }`}
              title={t.navSettings}
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer Menu (Categorized and clean) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Home Link */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition ${
              pathname === '/'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.navHome}</span>
          </Link>

          {/* Categorized Tools List */}
          {toolCategories.map((cat, idx) => (
            <div key={idx} className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-3">
                {cat.title}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <div className="flex-1">
                        <div className="font-semibold">{item.label}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Bottom Tools: History & Settings */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
            <Link
              href="/history"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            >
              <History className="w-4 h-4" />
              <span>{t.navHistory}</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            >
              <Settings className="w-4 h-4" />
              <span>{t.navSettings}</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
