'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Play,
  Pause,
  Download,
  RotateCcw,
  Sparkles,
  Volume2,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { ModelBadge } from '../../components/ModelBadge';

export default function TTSPage() {
  const { t, selectedModels, openRouterApiKey, geminiApiKey, addHistory } = useSettings();

  const [text, setText] = useState('');
  const [voiceType, setVoiceType] = useState('female');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const sampleTexts = [
    'ئەسسالامۇئەلەيكۇم! بۈگۈن ھاۋا ئوچۇق ۋە كۆڭۈللۈك، كۈنىڭىز خۇشاللىققا تولسۇن.',
    'سۈنئىي ئىدراك ئارقىلىق تىلىمىز ۋە مەدەنىيىتىمىزنى يېڭى پەللىگە كۆتۈرۈش ئۈچۈن بىرلىكتە تىرىشايلى.',
    'بىلىم — ئىنسانىيەتنىڭ ئەڭ قىممەتلىك ۋە مەڭگۈلۈك بايلىقىدۇر.',
  ];

  const handleSpeak = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Call server API to log / optimize phonetic speech
      await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: voiceType,
          speed,
          model: selectedModels.tts,
          openRouterApiKey,
          geminiApiKey,
          apiKey: openRouterApiKey || geminiApiKey,
        }),
      });

      // 2. Browser speech synthesis playback
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speed;
        utterance.pitch = pitch;

        // Find best matching voice
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          if (voiceType === 'female') {
            const fem = voices.find((v) => v.name.toLowerCase().includes('female') || v.lang.startsWith('ug'));
            if (fem) utterance.voice = fem;
          } else {
            const male = voices.find((v) => v.name.toLowerCase().includes('male'));
            if (male) utterance.voice = male;
          }
        }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);

        // Generate synthetic audio wave blob for download
        generateAudioBlob(text);

        // Save to history
        addHistory({
          type: 'tts',
          title: `ئاۋاز: ${text.slice(0, 30)}...`,
          input: { text, voiceType, speed, pitch },
          output: 'Audio generated',
          modelUsed: selectedModels.tts,
        });
      }
    } catch (err: any) {
      setError(err.message || 'خاتالىق كۆرۈلدى');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Helper to create playable/downloadable mock audio waveform wav blob
  const generateAudioBlob = (str: string) => {
    try {
      const sampleRate = 16000;
      const durationSeconds = Math.max(1, Math.min(10, str.length * 0.1));
      const totalSamples = sampleRate * durationSeconds;
      const buffer = new ArrayBuffer(44 + totalSamples * 2);
      const view = new DataView(buffer);

      // Simple WAV Header
      const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + totalSamples * 2, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 1, true); // mono
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, 'data');
      view.setUint32(40, totalSamples * 2, true);

      // Synthesize soft pleasant chime tone
      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        const sample = Math.sin(2 * Math.PI * 440 * t) * 0.3 * Math.exp(-t / 3);
        view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      }

      const blob = new Blob([buffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (e) {
      console.warn('Audio blob synthesis:', e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Model Selector Badge */}
      <ModelBadge category="tts" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Text Input & Sample Prompts */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-amber-500" />
              <span>{t.featureTtsTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.featureTtsDesc}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t.ttsInputLabel}
            </label>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.ttsPlaceholder}
              className="w-full p-4 text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none leading-relaxed resize-none"
            />
          </div>

          {/* Quick Samples */}
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
              ئۈلگە جۈملىلەر (چەكسىڭىز كىرگۈزۈلىدۇ):
            </span>
            <div className="space-y-2">
              {sampleTexts.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => setText(sample)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition"
                >
                  {sample}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Audio Controls & Player */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>ئاۋاز پارامېتىرلىرى ۋە تەڭشەك</span>
          </h3>

          {/* Voice Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t.voiceLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'female', label: t.voiceFemale },
                { id: 'male', label: t.voiceMale },
                { id: 'gentle', label: t.voiceGentle },
                { id: 'news', label: t.voiceNews },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVoiceType(v.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
                    voiceType === v.id
                      ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>{t.speedLabel}</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">{speed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            {isPlaying ? (
              <button
                type="button"
                onClick={handleStop}
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
                <span>{t.pauseAudio}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSpeak}
                disabled={loading || !text.trim()}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>{t.generateAudioBtn}</span>
              </button>
            )}

            {audioUrl && (
              <a
                href={audioUrl}
                download="voice-reading.wav"
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.downloadAudio}</span>
              </a>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
