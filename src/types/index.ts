export type Language = 'ug' | 'en';

export type Theme = 'light' | 'dark';

export type FeatureCategory =
  | 'chat'
  | 'translate'
  | 'image'
  | 'tts'
  | 'video'
  | 'ocr'
  | 'writer'
  | 'stt'
  | 'marketing';

export interface ModelOption {
  id: string;
  name: string;
  provider: 'openrouter' | 'gemini';
  category: FeatureCategory[];
  contextLength?: number;
  description?: string;
  pricing?: {
    prompt?: string;
    completion?: string;
  };
  recommended?: boolean;
}

export interface ModelSettings {
  openRouterApiKey: string;
  geminiApiKey: string;
  selectedModels: Record<FeatureCategory, string>;
  customModels: Record<FeatureCategory, string>;
}

export interface HistoryItem {
  id: string;
  type: FeatureCategory;
  title: string;
  timestamp: number;
  input: any;
  output: any;
  modelUsed: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface AspectRatioOption {
  id: string;
  label: string;
  ratio: string;
  width: number;
  height: number;
  iconName: string;
}
