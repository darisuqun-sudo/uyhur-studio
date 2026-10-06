'use client';

import React, { useState } from 'react';
import { X, Check, Cpu, Sparkles, ExternalLink, Sliders } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { FeatureCategory } from '../types';
import { DEFAULT_MODELS } from '../lib/constants';

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: FeatureCategory;
  title?: string;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const {
    t,
    selectedModels,
    setModelForCategory,
    customModels,
    setCustomModelForCategory,
    openRouterApiKey,
    geminiApiKey,
  } = useSettings();

  const currentModelId = selectedModels[category];
  const [customInput, setCustomInput] = useState(customModels[category] || '');
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  if (!isOpen) return null;

  const presetModels = DEFAULT_MODELS[category] || [];

  const handleSelectPreset = (modelId: string) => {
    setModelForCategory(category, modelId);
    onClose();
  };

  const handleApplyCustom = () => {
    if (customInput.trim()) {
      setCustomModelForCategory(category, customInput.trim());
      setModelForCategory(category, customInput.trim());
      onClose();
    }
  };

  const categoryNames: Record<FeatureCategory, string> = {
    chat: t.navChat,
    translate: t.navTranslate,
    image: t.navImage,
    tts: t.navTts,
    video: t.navVideo,
    ocr: 'رەسىمدىن تېكىست ئېلىش (OCR)',
    writer: 'ئەقلىي يېزىقچىلىق ۋە ئىملا',
    stt: 'ئاۋازنى تېكىستكە ئايلاندۇرۇش',
    marketing: 'ئىجتىمائىي تاراتقۇ ماركېتىنگ',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{categoryNames[category]}</span>
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  — {t.modelSelectorTitle}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.modelSelectorDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 px-5 pt-3">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'presets'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>تەۋسىيەلىك مودېللار (Presets)</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'custom'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>ئىختىيارىي كود كىرگۈزۈش (Custom)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'presets' ? (
            <div className="space-y-3">
              {presetModels.map((m) => {
                const isSelected = currentModelId === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectPreset(m.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                          {m.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                            m.provider === 'openrouter'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {m.provider === 'openrouter' ? 'OpenRouter' : 'Google Gemini'}
                        </span>
                        {m.recommended && (
                          <span className="text-[11px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                            تەۋسىيە
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {m.description}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        ID: {m.id}
                      </p>
                    </div>

                    <div className="pt-1">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <p>
                  💡 <strong>ئەسكەرتىش:</strong> سىز OpenRouter تەمىنلىگەن ھەرقانداق مودېل كودىنى كىرگۈزەلەيسىز.
                </p>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <a
                    href="https://openrouter.ai/models"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    OpenRouter بارلىق مودېللار تىزىملىكىنى كۆرۈش
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.customModelId}
                </label>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={t.customModelPlaceholder}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleApplyCustom}
                disabled={!customInput.trim()}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition"
              >
                بۇ مودېلنى تەتبىقلاش
              </button>
            </div>
          )}
        </div>

        {/* Footer info about API Keys */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>ئورۇنلاشتۇرۇلغان كۇنۇپكا:</span>
            <span
              className={`px-2 py-0.5 rounded ${
                openRouterApiKey
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {openRouterApiKey ? 'OpenRouter بار' : 'ئۆلچەملىك ئاچقۇچ'}
            </span>
            <span
              className={`px-2 py-0.5 rounded ${
                geminiApiKey
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {geminiApiKey ? 'Gemini بار' : 'Gemini يوق'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            تاقاش
          </button>
        </div>
      </div>
    </div>
  );
};
