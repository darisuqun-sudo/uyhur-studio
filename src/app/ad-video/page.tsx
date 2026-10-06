'use client';

import React, { useState } from 'react';
import {
  Video,
  Upload,
  ShieldCheck,
  Sparkles,
  Clapperboard,
  Film,
  Camera,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Clock,
  Play,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { ModelBadge } from '../../components/ModelBadge';

export default function AdVideoPage() {
  const { t, selectedModels, openRouterApiKey, geminiApiKey, addHistory } = useSettings();

  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [style, setStyle] = useState('luxury');
  const [ratio, setRatio] = useState('9:16');
  const [duration, setDuration] = useState('8s');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [storyboard, setStoryboard] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || loading) return;

    setLoading(true);
    setError(null);
    setStoryboard(null);

    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productDesc,
          style,
          ratio,
          duration,
          image: imagePreview,
          model: selectedModels.video,
          openRouterApiKey,
          geminiApiKey,
          apiKey: openRouterApiKey || geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate ad video storyboard');

      setStoryboard(data.storyboard);

      // Save to history
      addHistory({
        type: 'video',
        title: `ئىلان فىلىمى: ${productName}`,
        input: { productName, productDesc, style, ratio, duration },
        output: data.storyboard,
        modelUsed: selectedModels.video,
      });
    } catch (err: any) {
      setError(err.message || 'خاتالىق كۆرۈلدى');
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    if (!storyboard) return;
    const textToCopy = typeof storyboard === 'string' ? storyboard : JSON.stringify(storyboard, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Model Selector Badge */}
      <ModelBadge category="video" />

      {/* Safety Compliance Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 text-xs shadow-sm">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <span className="font-bold block">{t.humanFreeBadge}</span>
          <span className="text-[11px] opacity-80 mt-0.5 block">
            پىلانغا ئۇيغۇن ھالدا، فىلىمدە ئادەم چىرايى ياكى بەدىنى تامامەن چىقىرىۋېتىلىپ، پەقەت مەھسۇلاتنىڭ ئۆزى، ماتېرىيالى ۋە كەسپىي يورۇقلۇق قۇرۇلمىسى سۈرەتكە ئېلىنىدۇ.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-purple-500" />
              <span>{t.featureVideoTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.featureVideoDesc}
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.productImageLabel}
              </label>
              <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-purple-500 cursor-pointer bg-slate-50 dark:bg-slate-950 transition overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Product"
                      className="max-h-full max-w-full object-contain rounded-xl"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                      ئالماشتۇرۇش
                    </span>
                  </div>
                ) : (
                  <div className="text-center space-y-1.5 py-3">
                    <Upload className="w-7 h-7 mx-auto text-slate-400" />
                    <span className="text-xs text-slate-600 dark:text-slate-300 block font-medium">
                      {t.uploadImageHint}
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.productNameLabel}
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={t.productNamePlaceholder}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Product Brief */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.productDescLabel}
              </label>
              <textarea
                rows={3}
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                placeholder={t.productDescPlaceholder}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Ratio & Duration Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.videoRatioLabel}
                </label>
                <select
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none"
                >
                  <option value="9:16">9:16 (TikTok / Reels)</option>
                  <option value="16:9">16:9 (YouTube)</option>
                  <option value="1:1">1:1 (Square)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.videoDurationLabel}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none"
                >
                  <option value="5s">5 {t.duration5s}</option>
                  <option value="8s">8 {t.duration8s}</option>
                  <option value="15s">15 {t.duration15s}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !productName.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.generatingVideo}</span>
                </>
              ) : (
                <>
                  <Clapperboard className="w-4 h-4" />
                  <span>{t.generateVideoBtn}</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Storyboard & Shots Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[460px]">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-purple-500" />
                <span>{t.storyboardTitle}</span>
              </h3>
              {storyboard && (
                <button
                  onClick={copyScript}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 transition font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{t.copyScript}</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400 space-y-3 animate-pulse">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Film className="w-7 h-7 animate-spin" />
                </div>
                <p className="text-sm font-semibold">{t.generatingVideo}</p>
                <p className="text-xs text-slate-400 max-w-sm">
                  مەھسۇلاتنىڭ يورۇقلۇقى، كامېرا ھەرىكىتى ۋە ئادەمسىز كۆرۈنۈش تەرتىپى پىلانلىنىۋاتىدۇ...
                </p>
              </div>
            ) : storyboard ? (
              <div className="space-y-6 mt-4">
                
                {/* Header Concept */}
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
                  <h4 className="font-bold text-purple-900 dark:text-purple-200 text-sm">
                    {storyboard.title || `${productName} ئىلان فىلىمى`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {storyboard.concept}
                  </p>
                  {storyboard.lightingAndAtmosphere && (
                    <div className="text-[11px] text-purple-700 dark:text-purple-300 pt-1">
                      💡 <strong>يورۇقلۇق ۋە مۇھىت:</strong> {storyboard.lightingAndAtmosphere}
                    </div>
                  )}
                </div>

                {/* Shots list */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    كۆرۈنۈشلەر تەرتىپى (Shots List):
                  </span>
                  {storyboard.shots?.map((shot: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-purple-500" />
                          <span>{shot.name || `${index + 1}-كۆرۈنۈش`}</span>
                        </span>
                        <span className="font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{shot.duration}</span>
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <p><strong>كامېرا:</strong> {shot.cameraMotion}</p>
                        <p><strong>كۆرۈنۈش:</strong> {shot.visualDescription}</p>
                        {shot.voiceoverUg && (
                          <p className="text-purple-700 dark:text-purple-300 bg-purple-100/50 dark:bg-purple-950/30 p-2 rounded-lg">
                            🎙 <strong>ئۇيغۇرچە ئاۋاز تېكىستى:</strong> «{shot.voiceoverUg}»
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Veo / Video Model Master Prompt */}
                {storyboard.videoPromptVeo && (
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                      Veo / Kling / MiniMax سىن مودېلى Prompty:
                    </span>
                    <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {storyboard.videoPromptVeo}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-12 text-slate-400 dark:text-slate-500 space-y-3">
                <Clapperboard className="w-12 h-12 mx-auto stroke-1" />
                <p className="text-xs">
                  مەھسۇلات رەسىمى ۋە چۈشەندۈرۈشىنى كىرگۈزۈپ «ھاسىل قىلىش» نى بېسىڭ. سىستېما سىزگە كىنولۇق ئىلان فىلىمى سېنارىيەسى تۈزۈپ بېرىدۇ.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
