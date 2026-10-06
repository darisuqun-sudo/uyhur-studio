'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Image as ImageIcon,
  Languages,
  Mic,
  Video,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  ScanText,
  PenTool,
  Radio,
  Megaphone,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function HomePage() {
  const { t, language } = useSettings();

  const features = [
    {
      href: '/image',
      title: t.featureImageTitle,
      desc: t.featureImageDesc,
      icon: ImageIcon,
      color: 'from-pink-500 to-rose-600',
      badge: 'Gemini 3.8 Flash / Imaging',
    },
    {
      href: '/translate',
      title: t.featureTranslateTitle,
      desc: t.featureTranslateDesc,
      icon: Languages,
      color: 'from-blue-500 to-cyan-600',
      badge: 'Gemini 3.8 Flash',
    },
    {
      href: '/tts',
      title: t.featureTtsTitle,
      desc: t.featureTtsDesc,
      icon: Mic,
      color: 'from-amber-500 to-orange-600',
      badge: 'Gemini 3.8 Flash Audio',
    },
    {
      href: '/ad-video',
      title: t.featureVideoTitle,
      desc: t.featureVideoDesc,
      icon: Video,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Gemini 3.8 Flash Director',
    },
    {
      href: '/ocr',
      title: t.featureOcrTitle,
      desc: t.featureOcrDesc,
      icon: ScanText,
      color: 'from-indigo-500 to-blue-600',
      badge: 'Gemini 3.8 Flash Vision',
    },
    {
      href: '/writer',
      title: t.featureWriterTitle,
      desc: t.featureWriterDesc,
      icon: PenTool,
      color: 'from-fuchsia-500 to-purple-600',
      badge: 'Gemini 3.8 Flash Writer',
    },
    {
      href: '/stt',
      title: t.featureSttTitle,
      desc: t.featureSttDesc,
      icon: Radio,
      color: 'from-rose-500 to-red-600',
      badge: 'Speech to Text (STT)',
    },
    {
      href: '/marketing',
      title: t.featureMarketingTitle,
      desc: t.featureMarketingDesc,
      icon: Megaphone,
      color: 'from-amber-500 to-yellow-600',
      badge: 'Viral Copy & E-com',
    },
    {
      href: '/chat',
      title: t.featureChatTitle,
      desc: t.featureChatDesc,
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Gemini 3.8 Flash Chat',
    },
  ];

  return (
    <div className="space-y-12 py-4">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-900/20 via-slate-900/10 to-transparent p-8 sm:p-12 lg:p-16 border border-slate-200/60 dark:border-slate-800/80 text-center">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t.heroDesc}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/translate"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5"
            >
              <span>{t.startExploring}</span>
              <ArrowRight className={`w-4 h-4 ${language === 'ug' ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              href="/settings"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm transition"
            >
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>{t.navSettings}</span>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="relative mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>ئادەم چىرايى چىقماسلىق بىخەتەرلىك تەكشۈرۈشى</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>ھەر بىر تۈرگە ئايرىم مودېل بەلگىلەش</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <span>ئۇيغۇرچە (RTL) ۋە ئىنگىلىزچە تولۇق ئىككى تىل</span>
          </div>
        </div>
      </section>

      {/* 5 Core Feature Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.featuresHeading}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            5 ئاساسلىق بۆلەك
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.href}
                href={feat.href}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>باشلاش</span>
                  <ArrowRight
                    className={`w-4 h-4 transform group-hover:translate-x-1 transition ${
                      language === 'ug' ? 'rotate-180 group-hover:-translate-x-1' : ''
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
