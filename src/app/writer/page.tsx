'use client';

import React, { useState } from 'react';
import {
  PenTool,
  CheckCircle,
  Sparkles,
  Maximize2,
  Minimize2,
  Repeat,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { ModelBadge } from '../../components/ModelBadge';

export default function WriterPage() {
  const { t, selectedModels, openRouterApiKey, geminiApiKey, addHistory } = useSettings();

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('grammar');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modes = [
    { id: 'grammar', label: 'ئىملا ۋە گرامماتىكا تۈزىتىش', icon: CheckCircle },
    { id: 'polish', label: 'ئەدەبىي / رەسمىي تۈزەش', icon: Sparkles },
    { id: 'expand', label: 'كېڭەيتىپ ماقالە قىلىش', icon: Maximize2 },
    { id: 'summarize', label: 'قىسقارتىپ خۇلاسىلەش', icon: Minimize2 },
    { id: 'latin', label: 'ئەرەب يېزىقى ↔ ULY لاتىنچە', icon: Repeat },
  ];

  const handleProcess = async () => {
    if (!inputText.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          mode,
          model: selectedModels.writer,
          openRouterApiKey,
          geminiApiKey,
          apiKey: openRouterApiKey || geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process text');

      setOutputText(data.result);

      addHistory({
        type: 'writer',
        title: `ئەقلىي يېزىقچىلىق (${mode}): ${inputText.slice(0, 30)}...`,
        input: { text: inputText, mode },
        output: data.result,
        modelUsed: selectedModels.writer,
      });
    } catch (err: any) {
      setError(err.message || 'خاتالىق كۆرۈلدى');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!outputText || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(outputText);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      
      {/* Model Selector Badge */}
      <ModelBadge category="writer" />

      {/* Mode Selector Ribbon */}
      <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <PenTool className="w-4 h-4 text-purple-500" />
          <span>تەھرىرلەش ۋە ئىجادىيەت مەقسىتى:</span>
        </label>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Input Box */}
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                ئەسلى يېزىق / دەسلەپكى لايىھە
              </span>
              <span className="text-[11px] text-slate-400">
                {inputText.length} ھەرپ
              </span>
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="بۇ يەرگە تەكشۈرمەكچى، پىششىقلىماقچى ياكى كېڭەيتمەكچى بولغان ئۇيغۇرچە يېزىقنى كىرگۈزۈڭ..."
              className="w-full mt-3 p-2 bg-transparent text-slate-900 dark:text-slate-100 text-sm leading-relaxed border-none outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleProcess}
              disabled={!inputText.trim() || loading}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/20 transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>تەھرىرلىنىۋاتىدۇ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تەھرىرلەش ۋە بىر تەرەپ قىلىش</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Box */}
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                پىششىقلانغان يېڭى نەتىجە
              </span>

              {outputText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeak}
                    className="p-1.5 text-slate-500 hover:text-purple-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="ئاۋازلىق ئوقۇش"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 transition font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'كۆچۈرۈلدى!' : 'كۆچۈرۈش'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 p-2 min-h-[300px] text-xs sm:text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap text-slate-900 dark:text-slate-100">
              {loading ? (
                <div className="flex items-center gap-2 text-slate-400 py-12 animate-pulse justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
                  <span>سۈنئىي ئىدراك ئىملا ۋە بەدىئىي ئاھاڭنى پىششىقلاۋاتىدۇ...</span>
                </div>
              ) : outputText ? (
                outputText
              ) : (
                <div className="text-slate-400 text-xs italic py-8 text-center">
                  سول تەرەپكە مەزمۇننى كىرگۈزۈپ، مەقسەتلىك كۇنۇپكىنى بېسىڭ.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>{outputText ? `${outputText.length} ھەرپ` : 'تەييار'}</span>
            {copied && <span className="text-emerald-500 font-bold">كۆچۈرۈۋېلىندى!</span>}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
