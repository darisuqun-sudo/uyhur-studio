'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
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
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, theme, setTheme, t } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.navHome, icon: Sparkles },
    { href: '/image', label: t.navImage, icon: ImageIcon },
    { href: '/translate', label: t.navTranslate, icon: Languages },
    { href: '/ocr', label: t.navOcr, icon: ScanText },
    { href: '/writer', label: t.navWriter, icon: PenTool },
    { href: '/marketing', label: t.navMarketing, icon: Megaphone },
    { href: '/stt', label: t.navStt, icon: Radio },
    { href: '/tts', label: t.navTts, icon: Mic },
    { href: '/ad-video', label: t.navVideo, icon: Video },
    { href: '/chat', label: t.navChat, icon: MessageSquare },
    { href: '/history', label: t.navHistory, icon: History },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'ug' ? 'en' : 'ug');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {t.brandTitle}
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 dark:text-slate-500 leading-none">
                {t.brandSubtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (xl screens: all links) */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Medium Nav Links (lg to xl screens: top 5 links) */}
          <div className="hidden lg:flex xl:hidden items-center gap-0.5">
            {navLinks.slice(0, 5).map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions: Lang toggle, Theme toggle, Settings, Mobile Menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Switch Language / تىل ئالماشتۇرۇش"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'ug' ? 'EN' : 'ئۇيغۇرچە'}</span>
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition"
              title="Theme Toggle"
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
              className={`p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition ${
                pathname === '/settings'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : ''
              }`}
              title={t.navSettings}
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-1 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-500" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800">
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            >
              <Settings className="w-4 h-4 text-purple-500" />
              <span>{t.navSettings}</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
