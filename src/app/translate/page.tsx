'use client';

import React, { useState } from 'react';
import {
  Languages,
  ArrowLeftRight,
  Copy,
  Check,
  Volume2,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { ModelBadge } from '../../components/ModelBadge';

export default function TranslatePage() {
  const { t, selectedModels, openRouterApiKey, geminiApiKey, addHistory } = useSettings();

  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('ug');
  const [role, setRole] = useState('general');
  const [customRole, setCustomRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languages = [
    { code: 'ug', label: t.langUyghur, dir: 'rtl' },
    { code: 'en', label: t.langEnglish, dir: 'ltr' },
    { code: 'tr', label: t.langTurkish, dir: 'ltr' },
    { code: 'ar', label: t.langArabic, dir: 'rtl' },
    { code: 'zh', label: t.langChinese, dir: 'ltr' },
  ];

  const roles = [
    { id: 'general', label: t.roleGeneral },
    { id: 'formal', label: t.roleFormal },
    { id: 'literary', label: t.roleLiterary },
    { id: 'technical', label: t.roleTechnical },
    { id: 'business', label: t.roleBusiness },
    { id: 'student', label: t.roleStudent },
    { id: 'chat', label: t.roleChat },
  ];

  const handleSwap = () => {
    if (sourceLang === 'auto') return;
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const activeRole = customRole.trim() ? customRole.trim() : role;
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          targetLang,
          role: activeRole,
          model: selectedModels.translate,
          openRouterApiKey,
          geminiApiKey,
          apiKey: openRouterApiKey || geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Translation failed');

      setTranslatedText(data.translatedText);

      // Save to history
      addHistory({
        type: 'translate',
        title: `${sourceLang.toUpperCase()} → ${targetLang.toUpperCase()}: ${sourceText.slice(0, 30)}...`,
        input: { text: sourceText, sourceLang, targetLang, role: activeRole },
        output: data.translatedText,
        modelUsed: selectedModels.translate,
      });
    } catch (err: any) {
      setError(err.message || 'خاتالىق كۆرۈلدى');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = (txt: string, langCode: string) => {
    if (!txt || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(txt);
    if (langCode === 'ug') utterance.lang = 'ug';
    else if (langCode === 'en') utterance.lang = 'en-US';
    else if (langCode === 'tr') utterance.lang = 'tr-TR';
    else if (langCode === 'ar') utterance.lang = 'ar-SA';
    else if (langCode === 'zh') utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  const isTargetRtl = targetLang === 'ug' || targetLang === 'ar';
  const isSourceRtl = sourceLang === 'ug' || sourceLang === 'ar';

  return (
    <div className="space-y-6">
      
      {/* Model Selector Badge */}
      <ModelBadge category="translate" />

      {/* Role / Style Selection Strip */}
      <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>{t.roleStyleLabel}</span>
          </label>
          <span className="text-[11px] text-slate-400">
            تەرجىمە ئۇسلۇبى ۋە تەلەپپۇزى
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setRole(r.id);
                setCustomRole('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                role === r.id && !customRole
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Translation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Source Text Box */}
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="auto">{t.autoDetect}</option>
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSwap}
                disabled={sourceLang === 'auto'}
                className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                title={t.swapLanguages}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={8}
              dir={isSourceRtl ? 'rtl' : 'ltr'}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={t.sourcePlaceholder}
              className="w-full mt-3 p-2 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 border-none outline-none resize-none text-sm leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(sourceText, sourceLang)}
                disabled={!sourceText.trim()}
                className="p-2 text-slate-400 hover:text-blue-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                title={t.speakText}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-slate-400">
                {sourceText.length} ھەرپ
              </span>
            </div>

            <button
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.translating}</span>
                </>
              ) : (
                <>
                  <Languages className="w-3.5 h-3.5" />
                  <span>{t.translateBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Target Text Box */}
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => speakText(translatedText, targetLang)}
                  disabled={!translatedText}
                  className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                  title={t.speakText}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!translatedText}
                  className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                  title={t.copyText}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div
              dir={isTargetRtl ? 'rtl' : 'ltr'}
              className="mt-3 p-2 min-h-[220px] text-slate-900 dark:text-slate-100 text-sm leading-relaxed overflow-y-auto"
            >
              {loading ? (
                <div className="flex items-center gap-2 text-slate-400 animate-pulse py-8">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>تەرجىمە قىلىنىۋاتىدۇ...</span>
                </div>
              ) : translatedText ? (
                <div className="whitespace-pre-wrap">{translatedText}</div>
              ) : (
                <div className="text-slate-400 text-xs italic">
                  {t.targetPlaceholder}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              {translatedText ? `${translatedText.length} ھەرپ` : 'تەييار'}
            </span>
            {copied && <span className="text-emerald-500 font-semibold">{t.copied}</span>}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
