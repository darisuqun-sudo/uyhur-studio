'use client';

import React, { useState } from 'react';
import { Cpu, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { ModelSelectorModal } from './ModelSelectorModal';
import { FeatureCategory } from '../types';
import { DEFAULT_MODELS } from '../lib/constants';

interface ModelBadgeProps {
  category: FeatureCategory;
}

export const ModelBadge: React.FC<ModelBadgeProps> = ({ category }) => {
  const { t, selectedModels } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modelId = selectedModels[category];
  const allList = DEFAULT_MODELS[category] || [];
  const foundPreset = allList.find((m) => m.id === modelId);

  const displayName = foundPreset ? foundPreset.name : modelId;
  const isDirectGemini = modelId.startsWith('gemini-direct:') || modelId.startsWith('gemini');
  const isNative = modelId.startsWith('browser-native:');

  let providerLabel = 'OpenRouter';
  if (isDirectGemini) providerLabel = 'Google Gemini Direct';
  if (isNative) providerLabel = 'Native Audio Engine';

  return (
    <>
      <div className="flex items-center justify-between p-3 px-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/90 dark:to-slate-800/60 shadow-sm backdrop-blur-sm mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t.activeModel}:
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
                {displayName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">
                {providerLabel}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-lg transition border border-blue-200/60 dark:border-blue-800/50"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t.changeModel}</span>
        </button>
      </div>

      <ModelSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={category}
      />
    </>
  );
};
