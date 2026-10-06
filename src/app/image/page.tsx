'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { ModelBadge } from '../../components/ModelBadge';

export default function ImageStudioPage() {
  const { t, selectedModels, openRouterApiKey, geminiApiKey, addHistory } = useSettings();
  
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('realistic');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aspectRatios = [
    { id: '1:1', label: '1:1 (كۋادرات)', desc: 'Instagram / تېز كۆرۈنۈش' },
    { id: '16:9', label: '16:9 (يانچە كىنو)', desc: 'YouTube / ئېكران' },
    { id: '9:16', label: '9:16 (بويچە قىسقا)', desc: 'TikTok / Stories / Reels' },
    { id: '4:3', label: '4:3 (ئۆلچەملىك)', desc: 'iPad / فوتوگرافىيە' },
    { id: '3:4', label: '3:4 (پورتېرىت)', desc: 'سۈرەت / كىتاب مۇقاۋىسى' },
    { id: '3:2', label: '3:2 (فوتو نىسبىتى)', desc: 'DSLR كەسپىي كامېرا' },
  ];

  const styles = [
    { id: 'realistic', label: t.styleRealistic },
    { id: 'cinematic', label: t.styleCinematic },
    { id: '3d', label: t.style3D },
    { id: 'anime', label: t.styleAnime },
    { id: 'oil', label: t.styleOil },
    { id: 'cyberpunk', label: t.styleCyberpunk },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResultImage(null);
    setEnhancedPrompt(null);

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          style,
          model: selectedModels.image,
          openRouterApiKey,
          geminiApiKey,
          apiKey: openRouterApiKey || geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setResultImage(data.imageUrl);
      setEnhancedPrompt(data.enhancedPrompt);

      // Save to history
      addHistory({
        type: 'image',
        title: prompt.slice(0, 40) + '...',
        input: { prompt, aspectRatio, style },
        output: data.imageUrl,
        modelUsed: selectedModels.image,
      });
    } catch (err: any) {
      setError(err.message || 'خاتالىق كۆرۈلدى');
    } finally {
      setLoading(false);
    }
  };

  const copyPromptText = () => {
    if (enhancedPrompt || prompt) {
      navigator.clipboard.writeText(enhancedPrompt || prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Model Selector Badge */}
      <ModelBadge category="image" />

      {/* Main Grid: Controls on left/right, Preview on other */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span>{t.featureImageTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.featureImageDesc}
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Prompt Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.imagePromptLabel}
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.imagePromptPlaceholder}
                className="w-full p-3.5 text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none leading-relaxed resize-none"
              />
            </div>

            {/* Aspect Ratio Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.aspectRatioLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {aspectRatios.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAspectRatio(item.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-start transition flex flex-col justify-between ${
                      aspectRatio === item.id
                        ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 ring-1 ring-pink-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-bold">{item.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.styleLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition text-center ${
                      style === s.id
                        ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 ring-1 ring-pink-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-pink-500/25 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.generatingImage}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.generateImageBtn}</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        {/* Output & Preview Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[460px] flex flex-col justify-between">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-pink-500" />
                <span>{t.imageResultTitle}</span>
              </h3>
              {resultImage && (
                <div className="flex items-center gap-2">
                  <a
                    href={resultImage}
                    target="_blank"
                    rel="noreferrer"
                    download="generated-art.png"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 hover:bg-pink-100 border border-pink-200 dark:border-pink-800 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.downloadImage}</span>
                  </a>
                  <button
                    onClick={copyPromptText}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                    title={t.copyPrompt}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Display Box */}
            <div className="flex-1 my-4 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 overflow-hidden relative p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400 p-8 text-center animate-pulse">
                  <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                    <Sparkles className="w-7 h-7 animate-spin" />
                  </div>
                  <p className="text-sm font-medium">{t.generatingImage}</p>
                  <p className="text-xs text-slate-400">
                    ئۇيغۇرچە تەسۋىر ئىنگىلىزچە يۇقىرى سۈپەتلىك prompt قىلىپ كۈچەيتىلىۋاتىدۇ...
                  </p>
                </div>
              ) : resultImage ? (
                <div className="max-w-full max-h-[500px] flex items-center justify-center">
                  <img
                    src={resultImage}
                    alt={prompt}
                    className="rounded-xl shadow-lg object-contain max-h-[480px] w-auto border border-slate-200 dark:border-slate-800"
                  />
                </div>
              ) : (
                <div className="text-center p-8 space-y-3 text-slate-400 dark:text-slate-500 max-w-sm">
                  <ImageIcon className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-xs leading-relaxed">{t.noImageYet}</p>
                </div>
              )}
            </div>

            {/* Enhanced Prompt Display */}
            {enhancedPrompt && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  كۈچەيتىلگەن تەسۋىر (Master Prompt):
                </span>
                <p className="font-mono text-[11px] leading-relaxed line-clamp-2">
                  {enhancedPrompt}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
