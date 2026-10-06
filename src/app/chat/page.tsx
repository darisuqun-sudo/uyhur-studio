'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Trash2,
  Copy,
  Check,
  Volume2,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { ModelBadge } from '../../components/ModelBadge';
import { ChatMessage } from '../../types';

export default function ChatPage() {
  const { t, selectedModels, openRouterApiKey, geminiApiKey, addHistory } = useSettings();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [persona, setPersona] = useState('assistant');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: t.welcomeChatMessage,
        timestamp: Date.now(),
        model: selectedModels.chat,
      },
    ]);
  }, [t.welcomeChatMessage, selectedModels.chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const personas = [
    { id: 'assistant', label: t.chatAssistantRole },
    { id: 'translator', label: t.chatTranslatorRole },
    { id: 'tutor', label: t.chatTutorRole },
    { id: 'writer', label: t.chatCreativeRole },
  ];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const systemInstructionMap: Record<string, string> = {
        assistant:
          'You are a smart, polite, and helpful AI assistant proficient in Uyghur and English. Reply fluently in natural Uyghur Arabic script when prompted in Uyghur.',
        translator:
          'You are a professional literary and linguistic translation expert. Provide accurate translations and cross-cultural explanations.',
        tutor:
          'You are a patient and inspiring teacher. Explain concepts step by step in clear, simple, and engaging language.',
        writer:
          'You are a creative writer and poet. Express thoughts with artistic flair, vivid metaphors, and literary elegance.',
      };

      const apiMessages = [
        { role: 'system', content: systemInstructionMap[persona] || systemInstructionMap.assistant },
        ...newMessages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModels.chat,
          openRouterApiKey,
          geminiApiKey,
          apiKey: openRouterApiKey || geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chat request failed');

      const botMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
        model: data.model,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save to history
      addHistory({
        type: 'chat',
        title: userMsg.content.slice(0, 35) + '...',
        input: userMsg.content,
        output: data.reply.slice(0, 80) + '...',
        modelUsed: selectedModels.chat,
      });
    } catch (err: any) {
      setError(err.message || 'خاتالىق كۆرۈلدى');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: t.welcomeChatMessage,
        timestamp: Date.now(),
        model: selectedModels.chat,
      },
    ]);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      
      {/* Model Selector Badge */}
      <ModelBadge category="chat" />

      {/* Persona Strip & Clear Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900/80 p-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-wrap gap-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            رول:
          </span>
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                persona === p.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={t.clearChat}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.clearChat}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                  isUser
                    ? 'bg-slate-700 dark:bg-slate-600'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Footer tools on bot messages */}
                {!isUser && msg.id !== 'welcome' && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-[10px]">
                      {msg.model || selectedModels.chat}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="p-1 hover:text-blue-500 transition rounded"
                        title="ئاڭلاش"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 hover:text-blue-500 transition rounded"
                        title="كۆچۈرۈش"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
              <span>جاۋاب تەييارلىنىۋاتىدۇ...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chatPlaceholder}
          className="w-full py-4 pe-14 ps-5 text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute end-2 top-2 bottom-2 px-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
