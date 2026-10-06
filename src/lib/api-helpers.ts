/**
 * API Client helpers for OpenRouter and Google Gemini
 */

export interface AIRequestPayload {
  model: string;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  temperature?: number;
  max_tokens?: number;
  apiKey?: string;
  openRouterApiKey?: string;
  geminiApiKey?: string;
}

export async function callAIModel(payload: AIRequestPayload) {
  const {
    model,
    messages,
    temperature = 0.7,
    max_tokens = 2048,
    apiKey,
    openRouterApiKey,
    geminiApiKey,
  } = payload;

  const effectiveOpenRouterKey =
    openRouterApiKey?.trim() ||
    (apiKey?.startsWith('sk-') ? apiKey.trim() : '') ||
    process.env.OPENROUTER_API_KEY ||
    '';

  const effectiveGeminiKey =
    geminiApiKey?.trim() ||
    (apiKey?.startsWith('AIza') ? apiKey.trim() : '') ||
    process.env.GEMINI_API_KEY ||
    '';

  const isDirectGeminiFlag = model.startsWith('gemini-direct:');
  const shouldUseDirectGemini =
    isDirectGeminiFlag ||
    (Boolean(effectiveGeminiKey) && !effectiveOpenRouterKey && (model.includes('gemini') || model.includes('google')));

  // 1. Direct Gemini Call
  if (shouldUseDirectGemini) {
    if (!effectiveGeminiKey) {
      throw new Error('Google Gemini API Key تېپىلمىدى. تەڭشەكتىن ئاچقۇچىڭىزنى كىرگۈزۈڭ.');
    }

    let rawModel = isDirectGeminiFlag ? model.replace('gemini-direct:', '') : model;
    if (rawModel.startsWith('google/')) rawModel = rawModel.replace('google/', '');
    
    // Map to valid Google API model endpoints
    let actualGeminiModel = rawModel;
    if (actualGeminiModel.includes('3.8-flash') || actualGeminiModel.includes('flash')) {
      actualGeminiModel = 'gemini-3.8-flash';
    } else if (actualGeminiModel.includes('pro')) {
      actualGeminiModel = 'gemini-2.5-pro';
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${actualGeminiModel}:generateContent?key=${effectiveGeminiKey}`;

    // Map messages to Gemini format
    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const systemInstruction = messages.find((m) => m.role === 'system');

    const body: any = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: max_tokens,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction.content }],
      };
    }

    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini API خاتالىقى: ${res.statusText}`);
    }

    const data = await res.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { text: replyText, model: actualGeminiModel, provider: 'gemini' };
  }

  // 2. OpenRouter Call
  if (!effectiveOpenRouterKey) {
    // If no key provided, return structured intelligent simulation so the UI works gracefully
    console.warn('No OpenRouter API key found. Using intelligent fallback simulation.');
    return null;
  }

  const actualModel = model.startsWith('gemini-direct:')
    ? 'google/' + model.replace('gemini-direct:', '')
    : model;

  const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
  const res = await fetch(openRouterUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${effectiveOpenRouterKey}`,
      'HTTP-Referer': 'https://aqil-hub.local',
      'X-Title': 'Aqil AI Hub',
    },
    body: JSON.stringify({
      model: actualModel,
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenRouter API خاتالىقى: ${res.statusText}`);
  }

  const data = await res.json();
  const replyText = data?.choices?.[0]?.message?.content || '';
  return { text: replyText, model: actualModel, provider: 'openrouter' };
}
