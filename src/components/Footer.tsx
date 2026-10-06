'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Footer: React.FC = () => {
  const { t } = useSettings();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs py-8 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 flex-shrink-0">
            <img src="/logo.png" alt="ئاقىللار مۇنبىرى" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {t.brandTitle}
          </span>
          <span>© 2026. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">OpenRouter</span>
            <span>&</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Google Gemini</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/settings" className="hover:text-blue-500 transition">
            {t.navSettings}
          </Link>
          <Link href="/history" className="hover:text-blue-500 transition">
            {t.navHistory}
          </Link>
        </div>
      </div>
    </footer>
  );
};
