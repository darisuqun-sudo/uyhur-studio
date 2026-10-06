'use client';

import React, { useState } from 'react';
import {
  ScanText,
  Upload,
  Copy,
  Check,
  Languages,
  Volume2,
  RefreshCw,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '../../context/SettingsContext';
import { ModelBadge } from '../../components/ModelBadge';

export default function OcrPage() {
  const { t, selectedModels, openRouterApiKey, geminiApiKey, addHistory } = useSettings();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setExtractedText(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!imagePreview || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imagePreview,
          model: selectedModels.ocr,
          openRouterApiKey,
          geminiApiKey,
          apiKey: geminiApiKey || openRouterApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to extract text');

      setExtractedText(data.text);

      addHistory({
        type: 'ocr',
        title: `تېكىست تونۇش (OCR): ${data.text.slice(0, 30)}...`,
        input: 'Image document',
        output: data.text,
        modelUsed: selectedModels.ocr,
      });
    } catch (err: any) {
      setError(err.message || 'خاتالىق كۆرۈلدى');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!extractedText || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(extractedText);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      
      {/* Model Selector Badge */}
      <ModelBadge category="ocr" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Upload & Preview */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ScanText className="w-5 h-5 text-indigo-500" />
              <span>{t.featureOcrTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.featureOcrDesc}
            </p>
          </div>

          <div>
            <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl hover:border-indigo-500 cursor-pointer bg-slate-50 dark:bg-slate-950 transition overflow-hidden min-h-[220px]">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative w-full flex flex-col items-center justify-center space-y-2">
                  <img
                    src={imagePreview}
                    alt="Document preview"
                    className="max-h-64 max-w-full object-contain rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
                  />
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold underline">
                    رەسىمنى ئالماشتۇرۇش
                  </span>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                      ھۆججەت ياكى رەسىمنى تاللاڭ
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      كىتاب، خەت پۈتۈكى، تالون ياكى يانفون فوتو رەسىملىرىنى قوللايدۇ
                    </span>
                  </div>
                </div>
              )}
            </label>
          </div>

          <button
            onClick={handleExtract}
            disabled={!imagePreview || loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>تېكىست تونۇلىۋاتىدۇ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>رەسىمدىن تېكىستنى ئېلىش</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Extracted Text & Actions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[460px] flex flex-col justify-between">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>تېكىست نەتىجىسى (Extracted Text)</span>
                </h3>

                {extractedText && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSpeak}
                      className="p-1.5 text-slate-500 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="ئاۋازلىق ئوقۇش"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition font-semibold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'كۆچۈرۈلدى!' : 'كۆچۈرۈش'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Text Body */}
              <div className="mt-4 min-h-[260px] text-xs sm:text-sm leading-relaxed overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-3 animate-pulse text-center">
                    <ScanText className="w-12 h-12 animate-bounce text-indigo-500" />
                    <p className="text-sm font-bold">ھۆججەت كۆرۈنۈشى تەھلىل قىلىنىۋاتىدۇ...</p>
                    <p className="text-xs">ئۇيغۇرچە يېزىق ۋە ھەرپلەر ئېنىقلىنىۋاتىدۇ.</p>
                  </div>
                ) : extractedText ? (
                  <div className="whitespace-pre-wrap p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                    {extractedText}
                  </div>
                ) : (
                  <div className="text-center p-12 text-slate-400 dark:text-slate-500 space-y-2">
                    <ScanText className="w-12 h-12 mx-auto stroke-1" />
                    <p className="text-xs">
                      سول تەرەپكە رەسىم ياكى پۈتۈكنى يۈكلەپ «تېكىستنى ئېلىش» نى بېسىڭ.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick action bar */}
            {extractedText && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs flex-wrap gap-3">
                <span className="text-slate-400">
                  {extractedText.length} ھەرپ ئېنىقلاندى
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href="/translate"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-900 transition font-semibold"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>تەرجىمىگە ئەۋەتىش</span>
                  </Link>

                  <Link
                    href="/writer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-900 transition font-semibold"
                  >
                    <span>ئەقلىي تەھرىرلەش</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
