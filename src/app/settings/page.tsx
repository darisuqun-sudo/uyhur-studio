'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Cpu,
  Save,
  Check,
  Shield,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { DEFAULT_MODELS } from '../../lib/constants';

export default function SettingsPage() {
  const {
    t,
    openRouterApiKey,
    setOpenRouterApiKey,
    geminiApiKey,
    setGeminiApiKey,
    selectedModels,
    setModelForCategory,
    applyGemini38FlashToAll,
    customModels,
    setCustomModelForCategory,
  } = useSettings();

  const [localOpenRouterKey, setLocalOpenRouterKey] = useState(openRouterApiKey);
  const [localGeminiKey, setLocalGeminiKey] = useState(geminiApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [batchApplied, setBatchApplied] = useState(false);
  const [testingKeys, setTestingKeys] = useState(false);
  const [testResults, setTestResults] = useState<{
    openRouter?: { valid: boolean; message: string };
    gemini?: { valid: boolean; message: string };
  } | null>(null);

  // Sync API keys when loaded from localStorage
  useEffect(() => {
    if (openRouterApiKey) setLocalOpenRouterKey(openRouterApiKey);
  }, [openRouterApiKey]);

  useEffect(() => {
    if (geminiApiKey) setLocalGeminiKey(geminiApiKey);
  }, [geminiApiKey]);

  const categories = [
    { key: 'chat', label: t.navChat, desc: 'ئاقىل پاراڭچى بوت ئۈچۈن ئىشلىتىلىدىغان مودېل' },
    { key: 'translate', label: t.navTranslate, desc: 'ئۇيغۇرچە ۋە كۆپ تىللىق تەرجىمە ئۈچۈن مودېل' },
    { key: 'image', label: t.navImage, desc: 'رەسىم ھاسىل قىلىش ۋە سۈپەت كۈچەيتىش ئۈچۈن مودېل' },
    { key: 'tts', label: t.navTts, desc: 'تېكىستنى ئاۋازغا ئايلاندۇرۇش ماتورى ياكى مودېلى' },
    { key: 'video', label: t.navVideo, desc: 'كەسپىي ئىلان فىلىمى سېنارىيەسى ۋە كۆرۈنۈش لايىھەسى ئۈچۈن مودېل' },
    { key: 'ocr', label: t.navOcr, desc: 'رەسىمدىن ئۇيغۇرچە ۋە كۆپ تىللىق تېكىست ئېلىش مودېلى (Vision OCR)' },
    { key: 'writer', label: t.navWriter, desc: 'ئۇيغۇرچە ئىملا تەكشۈرۈش، ماقالە ۋە ئەدەبىي يېزىقچىلىق مودېلى' },
    { key: 'stt', label: t.navStt, desc: 'ئاۋازنى تېكىستكە ئايلاندۇرۇش ماتورى (Speech-to-Text)' },
    { key: 'marketing', label: t.navMarketing, desc: 'ئىجتىمائىي تاراتقۇ ۋە تور دۇكانلىرى ئۈچۈن ئىلان كۆپەيتكۈچى مودېل' },
  ] as const;

  const handleApplyAll = () => {
    applyGemini38FlashToAll();
    setBatchApplied(true);
    setTimeout(() => setBatchApplied(false), 3500);
  };

  const handleVerifyKeys = async () => {
    if (!localOpenRouterKey.trim() && !localGeminiKey.trim()) {
      alert('سىناش ئۈچۈن ئالدى بىلەن OpenRouter ياكى Gemini API ئاچقۇچىڭىزنى كىرگۈزۈڭ.');
      return;
    }
    setTestingKeys(true);
    setTestResults(null);
    try {
      const res = await fetch('/api/verify-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          openRouterApiKey: localOpenRouterKey.trim(),
          geminiApiKey: localGeminiKey.trim(),
        }),
      });
      const data = await res.json();
      setTestResults(data.results || {});
    } catch {
      setTestResults({
        openRouter: { valid: false, message: 'تور ئۇلىنىشى مەغلۇپ بولدى' },
      });
    } finally {
      setTestingKeys(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenRouterApiKey(localOpenRouterKey.trim());
    setGeminiApiKey(localGeminiKey.trim());
    
    // Explicitly re-persist selected models and custom models to localStorage
    try {
      localStorage.setItem('app_selected_models', JSON.stringify(selectedModels));
      localStorage.setItem('app_custom_models', JSON.stringify(customModels));
      localStorage.setItem('app_model_version', '3.8-expanded');
    } catch (err) {
      console.error(err);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-blue-500" />
            <span>{t.navSettings}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            API ئاچقۇچلىرىنى ساقلاش ۋە ھەر بىر ئىقتىدارغا ئايرىم سۈنئىي ئىدراك مودېلى بەلگىلەش
          </p>
        </div>

        {/* Top Success Badge */}
        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>تەڭشەكلەر مۇۋەپپەقىيەتلىك ساقلاندى!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: API Keys */}
        <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-500" />
              <span>API ئاچقۇچ تەڭشەكلىرى (API Keys)</span>
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>{t.apiKeyNotice}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* OpenRouter Key */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.openRouterKey}
                </label>
                <a
                  href="https://openrouter.ai/settings/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  <span>ئاچقۇچ ئېلىش</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={localOpenRouterKey}
                onChange={(e) => setLocalOpenRouterKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Gemini Key */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.geminiKey}
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Google AI Studio دىن ئېلىش</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={localGeminiKey}
                onChange={(e) => setLocalGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Test Keys Action & Feedback */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleVerifyKeys}
              disabled={testingKeys}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-2 border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>{testingKeys ? 'ئاچقۇچ ئۇلىنىشى سىنىلىۋاتىدۇ...' : 'ئاچقۇچ ئۇلىنىشىنى سىناش (Test Connection)'}</span>
            </button>

            {testResults && (
              <div className="flex flex-col sm:flex-row gap-2 text-xs">
                {testResults.openRouter && (
                  <div
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                      testResults.openRouter.valid
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <span>OpenRouter: {testResults.openRouter.message}</span>
                  </div>
                )}
                {testResults.gemini && (
                  <div
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                      testResults.gemini.valid
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <span>Gemini: {testResults.gemini.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Model Routing for Each Feature */}
        <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span>ھەر بىر تۈر ئۈچۈن مودېل تاللاش مەركىزى</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                سىز OpenRouter دىكى بارلىق مودېللارنى خالىغانچە تەقسىملىيەلەيسىز ياكى ئىختىيارىي مودېل كودى كىرگۈزەلەيسىز.
              </p>
            </div>

            {/* Batch Button with Live Status */}
            <button
              type="button"
              onClick={handleApplyAll}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition transform active:scale-95 ${
                batchApplied
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-slate-900'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-blue-500/25'
              }`}
            >
              {batchApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  <span>تەتبىقلاندى! بارلىق تۈرلەرگە Gemini 3.8 Flash بېكىتىلدى ✓</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>بارلىق تۈرلەرگە Gemini 3.8 Flash نى تەتبىقلاش</span>
                </>
              )}
            </button>
          </div>

          {/* Model cards */}
          <div className="space-y-5">
            {categories.map((cat) => {
              const currentModel = selectedModels[cat.key];
              const presets = DEFAULT_MODELS[cat.key] || [];

              return (
                <div
                  key={cat.key}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {cat.label}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {cat.desc}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono px-3 py-1 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold border border-blue-200/50 dark:border-blue-800/50">
                      نۆۋەتتە: {currentModel}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Preset Selector */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        تەييار تەۋسىيە مودېللار:
                      </label>
                      <select
                        value={currentModel}
                        onChange={(e) => setModelForCategory(cat.key, e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {presets.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.provider})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Model ID Entry */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        ياكى ئىختىيارىي OpenRouter مودېل كودى كىرگۈزۈڭ:
                      </label>
                      <input
                        type="text"
                        value={customModels[cat.key] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomModelForCategory(cat.key, val);
                          if (val.trim()) setModelForCategory(cat.key, val.trim());
                        }}
                        placeholder="مەسىلەن: google/gemini-3.8-flash"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Bar with Immediate Visual State */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex-wrap gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {savedSuccess ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>بارلىق API ئاچقۇچلىرى ۋە تاللانغان مودېللار مۇۋەپپەقىيەتلىك ساقلاندى!</span>
              </span>
            ) : (
              <span>بارلىق ئۆزگەرتىشلەرنى ساقلاش ئۈچۈن كۇنۇپكىنى بېسىڭ</span>
            )}
          </div>

          <button
            type="submit"
            className={`px-8 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg transition transform active:scale-95 flex items-center gap-2 ${
              savedSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400 shadow-emerald-500/25'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span>تەڭشەكلەر ساقلاندى! ✓</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t.saveSettings}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
