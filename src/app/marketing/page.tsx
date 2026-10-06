'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Share2,
  Sparkles,
  ShoppingBag,
  Send,
  Video,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { ModelBadge } from '../../components/ModelBadge';

export default function MarketingPage() {
  const { t, selectedModels, openRouterApiKey, geminiApiKey, addHistory } = useSettings();

  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [tone, setTone] = useState('hook');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    { id: 'tiktok', label: 'TikTok / Reels قىسقا سىن', icon: Video },
    { id: 'instagram', label: 'Instagram / فىلىم ۋە رەسىم', icon: Share2 },
    { id: 'ecommerce', label: 'تور دۇكىنى ۋە مەھسۇلات', icon: ShoppingBag },
    { id: 'telegram', label: 'Telegram / خەۋەر قانىلى', icon: Send },
  ];

  const tones = [
    { id: 'hook', label: '🎯 خېرىدارنى جەلپ قىلىش (High Hook)' },
    { id: 'story', label: '📖 ھېكايە ۋە تەسىرلىك بايان' },
    { id: 'urgent', label: '⚡ ئالدىراشلىق ۋە تەشۋىقات پۇرسىتى' },
    { id: 'trust', label: '🤝 كەسپىي ۋە ئىشەنچلىك ئوبراز' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult('');

    try {
      const res = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platform,
          tone,
          model: selectedModels.marketing,
          openRouterApiKey,
          geminiApiKey,
          apiKey: openRouterApiKey || geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate marketing copy');

      setResult(data.content);

      addHistory({
        type: 'marketing',
        title: `ماركېتىنگ: ${topic.slice(0, 30)}...`,
        input: { topic, platform, tone },
        output: data.content,
        modelUsed: selectedModels.marketing,
      });
    } catch (err: any) {
      setError(err.message || 'خاتالىق كۆرۈلدى');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!result || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(result);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      
      {/* Model Selector Badge */}
      <ModelBadge category="marketing" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Generator Form */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
              <span>{t.featureMarketingTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.featureMarketingDesc}
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                تەشۋىق قىلماقچى بولغان تېما ياكى مەھسۇلات:
              </label>
              <textarea
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مەسىلەن: ئەنئەنىۋى ئۇيغۇر ئېسىل دوپپىلىرى، ساپ پاختا، ئېسىل كۆرۈنۈش، كۈز پەسىللىك تەشۋىقات..."
                className="w-full p-3 text-xs rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-none"
              />
            </div>

            {/* Target Platform */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                نىشان سۇپا:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                        platform === p.id
                          ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 ring-1 ring-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="truncate">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ئىلان ئۇسلۇبى ۋە ئاھاڭى:
              </label>
              <div className="space-y-1.5">
                {tones.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTone(item.id)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-medium text-start transition flex items-center justify-between ${
                      tone === item.id
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 ring-1 ring-amber-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {tone === item.id && <Check className="w-3.5 h-3.5 text-amber-500" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!topic.trim() || loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ۋىرۇسلۇق ئىلان پىلانلىنىۋاتىدۇ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تەشۋىقات ئىلان تېكىستى ھاسىللاش</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Copy Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[460px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-500" />
                  <span>ھاسىل بولغان كەسپىي ئىلان تېكىستى</span>
                </h3>

                {result && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSpeak}
                      className="p-1.5 text-slate-500 hover:text-amber-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="ئاۋازلىق ئوقۇش"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 transition font-semibold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'كۆچۈرۈلدى!' : 'تېكىستنى كۆچۈرۈش'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 min-h-[300px] text-xs sm:text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap text-slate-900 dark:text-slate-100">
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-3 animate-pulse text-center">
                    <Megaphone className="w-12 h-12 animate-bounce text-amber-500" />
                    <p className="text-sm font-bold">بازارشۇناسلىق پىسخىكىسى بويىچە لايىھەلىنىۋاتىدۇ...</p>
                    <p className="text-xs">خېرىدارنى جەلپ قىلىش ماۋزۇسى ۋە بەلگىلەر تۈزۈلۈۋاتىدۇ.</p>
                  </div>
                ) : result ? (
                  <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                    {result}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400 dark:text-slate-500 space-y-2">
                    <Megaphone className="w-12 h-12 mx-auto stroke-1" />
                    <p className="text-xs">
                      سول تەرەپتىن سۇپا ۋە مەزمۇننى كىرگۈزۈپ «ھاسىللاش» نى بېسىڭ.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {result && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>{result.length} ھەرپ</span>
                {copied && <span className="text-emerald-500 font-bold">پۈتۈن ئىلان كۆچۈرۈلدى!</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
