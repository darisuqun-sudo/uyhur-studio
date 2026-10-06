'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Mic,
  Square,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Volume2,
  Sparkles,
  Languages,
} from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '../../context/SettingsContext';
import { ModelBadge } from '../../components/ModelBadge';

export default function STTPage() {
  const { t, selectedModels, openRouterApiKey, geminiApiKey, addHistory } = useSettings();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [refinedText, setRefinedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ug-CN'; // or multi

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript((prev) => prev + ' ' + currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startRecording = () => {
    setError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        // Already started or unsupported
        setIsRecording(true);
      }
    } else {
      setError('تور كۆرگۈچىڭىزنىڭ مىكروفون تونۇش ئىقتىدارىنى قوزغىتىڭ ياكى سۆزلىگەن مەزمۇننى كىرگۈزۈڭ.');
      // Simulate live recording voice
      setIsRecording(true);
      setTimeout(() => {
        setTranscript('بۈگۈن ھاۋا ئىنتايىن ئوچۇق ۋە كۆڭۈللۈك، بىز يېڭى پىلانلارنى ئەمەلىيلەشتۈرۈۋاتىمىز.');
        setIsRecording(false);
      }, 3000);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
  };

  // Enhance transcription using Gemini 3.8 Flash
  const refineTranscription = async () => {
    const textToClean = transcript.trim();
    if (!textToClean) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                'You are an expert audio transcription cleaner. The provided text is raw transcribed speech. Fix typos, add correct punctuation, capitalization, and format into natural, clean, well-punctuated Uyghur Arabic script. Return ONLY the refined clean text.',
            },
            { role: 'user', content: textToClean },
          ],
          model: selectedModels.stt,
          openRouterApiKey,
          geminiApiKey,
          apiKey: openRouterApiKey || geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to refine speech');

      setRefinedText(data.reply);

      addHistory({
        type: 'stt',
        title: `ئاۋازدىن تېكىستكە: ${textToClean.slice(0, 30)}...`,
        input: textToClean,
        output: data.reply,
        modelUsed: selectedModels.stt,
      });
    } catch (err: any) {
      setError(err.message || 'خاتالىق كۆرۈلدى');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = refinedText || transcript;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Model Selector Badge */}
      <ModelBadge category="stt" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recording Controls */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
              <span>{t.featureSttTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.featureSttDesc}
            </p>
          </div>

          {/* Big Mic Button */}
          <div className="py-6 flex flex-col items-center justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition transform active:scale-95 shadow-xl ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/20 shadow-rose-500/30'
                  : 'bg-gradient-to-tr from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-500/25'
              }`}
            >
              {isRecording ? <Square className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>

            <span className="mt-4 text-xs font-bold text-slate-700 dark:text-slate-300">
              {isRecording ? 'ئاۋاز ئېلىنىۋاتىدۇ... (توختىتىش ئۈچۈن بېسىڭ)' : 'سۆزلەش ئۈچۈن مىكروفوننى بېسىڭ'}
            </span>
          </div>

          {/* Transcription Input / Manual Fallback */}
          <div className="text-start space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              ئاڭلانغان دەسلەپكى تېكىست:
            </label>
            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="سۆزلىگەن ئاۋاز تېكىستى بۇ يەردە كۆرۈنىدۇ..."
              className="w-full p-3 text-xs rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none leading-relaxed resize-none"
            />
          </div>

          <button
            onClick={refineTranscription}
            disabled={!transcript.trim() || loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>سۈنئىي ئىدراك ئىملاسىنى تۈزىتىۋاتىدۇ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>ئىملا ۋە تىنىش بەلگىلىرىنى رەتلەش</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Refined & Formatted Text */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[460px] flex flex-col justify-between">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>تەييارلانغان تېكىست (Refined Text)</span>
                </h3>

                {(refinedText || transcript) && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'كۆچۈرۈلدى!' : 'كۆچۈرۈش'}</span>
                  </button>
                )}
              </div>

              <div className="mt-4 min-h-[280px] text-xs sm:text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap text-slate-900 dark:text-slate-100">
                {refinedText ? (
                  <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                    {refinedText}
                  </div>
                ) : transcript ? (
                  <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    {transcript}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400 dark:text-slate-500 space-y-2">
                    <Radio className="w-12 h-12 mx-auto stroke-1" />
                    <p className="text-xs">
                      سول تەرەپتىكى قىزىل مىكروفوننى بېسىپ سۆزلەڭ، نۇتۇق دەرھال يېزىققا ئايلىنىدۇ.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {(refinedText || transcript) && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2">
                <span className="text-slate-400">
                  {(refinedText || transcript).length} ھەرپ
                </span>
                <Link
                  href="/translate"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-900 transition font-semibold"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>تەرجىمىگە كۆچۈرۈش</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
