'use client';

import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Trash2,
  Image as ImageIcon,
  Languages,
  Mic,
  Video,
  MessageSquare,
  Clock,
  Cpu,
  Copy,
  Check,
  ScanText,
  PenTool,
  Radio,
  Megaphone,
  Search,
  Download,
  X,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function HistoryPage() {
  const { t, history, clearHistory, removeHistoryItem } = useSettings();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = history.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(q);
    const outputMatch =
      typeof item.output === 'string'
        ? item.output.toLowerCase().includes(q)
        : JSON.stringify(item.output).toLowerCase().includes(q);
    return titleMatch || outputMatch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-pink-500" />;
      case 'translate':
        return <Languages className="w-4 h-4 text-blue-500" />;
      case 'tts':
        return <Mic className="w-4 h-4 text-amber-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-500" />;
      case 'ocr':
        return <ScanText className="w-4 h-4 text-indigo-500" />;
      case 'writer':
        return <PenTool className="w-4 h-4 text-fuchsia-500" />;
      case 'stt':
        return <Radio className="w-4 h-4 text-rose-500" />;
      case 'marketing':
        return <Megaphone className="w-4 h-4 text-amber-500" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      default:
        return <HistoryIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = () => {
    if (history.length === 0) return;
    const jsonStr = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aqil-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <HistoryIcon className="w-6 h-6 text-blue-500" />
            <span>{t.historyTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            بارلىق رەسىم، تەرجىمە، يېزىقچىلىق، سۆز ۋە ئىلانلار مۇشۇ يەردە بىخەتەر ساقلىنىدۇ
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-900 transition font-medium"
              title="تارىخنى JSON شەكلىدە ساقلىۋېلىش"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ئېكسپورت (JSON)</span>
            </button>

            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900 transition font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearHistory}</span>
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="تارىخ مەزمۇنى ياكى ماۋزۇسىدىن ئىزدەش..."
            className="w-full pr-9 pl-8 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 -translate-y-1/2 left-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'ھەممىسى' },
            { id: 'image', label: t.navImage },
            { id: 'translate', label: t.navTranslate },
            { id: 'ocr', label: t.navOcr },
            { id: 'writer', label: t.navWriter },
            { id: 'marketing', label: t.navMarketing },
            { id: 'stt', label: t.navStt },
            { id: 'tts', label: t.navTts },
            { id: 'video', label: t.navVideo },
            { id: 'chat', label: t.navChat },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
          <HistoryIcon className="w-12 h-12 mx-auto stroke-1" />
          <p className="text-xs">{searchQuery ? 'ئىزدەش نەتىجىسى تېپىلمىدى.' : t.noHistory}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-500/30 transition"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {getIcon(item.type)}
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[200px]">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>
                </div>

                {/* Content preview */}
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                  {item.type === 'image' && typeof item.output === 'string' && (
                    <img
                      src={item.output}
                      alt={item.title}
                      className="w-full h-44 object-cover rounded-xl mt-1 border border-slate-200 dark:border-slate-800"
                    />
                  )}

                  {(item.type === 'translate' ||
                    item.type === 'ocr' ||
                    item.type === 'writer' ||
                    item.type === 'marketing' ||
                    item.type === 'stt') && (
                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 whitespace-pre-wrap line-clamp-4 leading-relaxed font-sans text-xs">
                      {typeof item.output === 'string'
                        ? item.output
                        : JSON.stringify(item.output, null, 2)}
                    </div>
                  )}

                  {item.type === 'tts' && (
                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="line-clamp-2">{item.input?.text}</p>
                    </div>
                  )}

                  {item.type === 'video' && (
                    <div className="bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40 text-[11px] space-y-1">
                      <p className="font-bold text-purple-800 dark:text-purple-300">
                        {item.output?.title}
                      </p>
                      <p className="line-clamp-2 text-slate-500 dark:text-slate-400">
                        {item.output?.concept}
                      </p>
                    </div>
                  )}

                  {item.type === 'chat' && (
                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 line-clamp-3">
                      {item.output}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer info & Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <Cpu className="w-3 h-3 text-blue-500" />
                  <span>{item.modelUsed}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      handleCopy(
                        item.id,
                        typeof item.output === 'string'
                          ? item.output
                          : JSON.stringify(item.output, null, 2)
                      )
                    }
                    className="p-1.5 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-lg"
                    title="كۆچۈرۈش"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => removeHistoryItem(item.id)}
                    className="p-1.5 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition rounded-lg"
                    title="بۇ تۈرنى ئۆچۈرۈش"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
