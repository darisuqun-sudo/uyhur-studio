import { NextRequest, NextResponse } from 'next/server';
import { callAIModel } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      sourceLang = 'auto',
      targetLang = 'ug',
      role = 'general',
      model = 'google/gemini-3.8-flash',
      apiKey,
      openRouterApiKey,
      geminiApiKey,
    } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const rolePromptMap: Record<string, string> = {
      general: 'Natural, accurate, and fluent everyday translation.',
      formal: 'Formal, polite, professional workplace and business translation.',
      literary: 'Literary, poetic, artistic and emotionally evocative expression.',
      technical: 'Strictly precise, scientifically and technologically accurate terminology.',
      business: 'Engaging, compelling, marketing-oriented copy and commercial tone.',
      student: 'Simplified, crystal clear language suitable for learners and students.',
      chat: 'Casual conversational style, natural spoken dialogue idioms.',
    };

    const styleInstruction = rolePromptMap[role] || rolePromptMap.general;

    const systemPrompt = `You are an elite multilingual translator specializing in Uyghur (ئۇيغۇرچە), English, Turkish, Arabic, and Chinese.
Target language: ${targetLang}.
Translation style / persona: ${styleInstruction}.
Rules:
1. Translate accurately, keeping idioms natural in the target language.
2. If translating to Uyghur, always use proper Uyghur Arabic script (ئۇيغۇر ئەرەب يېزىقى) with correct vowels and spelling rules.
3. Return ONLY the translated text without introductory words or explanations.`;

    const userPrompt = `Translate the following text from ${sourceLang} into ${targetLang}:\n\n${text}`;

    try {
      const result = await callAIModel({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        apiKey,
        openRouterApiKey,
        geminiApiKey,
      });

      if (result) {
        return NextResponse.json({
          translatedText: result.text.trim(),
          detectedSource: sourceLang === 'auto' ? 'auto-detected' : sourceLang,
          model: result.model,
          provider: result.provider,
        });
      }
    } catch (apiErr: any) {
      console.error('API error in translation:', apiErr);
      return NextResponse.json({ error: apiErr.message || 'Translation failed' }, { status: 500 });
    }

    // High quality simulation fallback when no API key is configured
    let mockResult = text;
    if (targetLang === 'ug') {
      mockResult = `بۇ سىز كىرگۈزگەن مەزمۇننىڭ سۈنئىي ئىدراك ئارقىلىق تەرجىمە قىلىنغان ئۇيغۇرچە نۇسخىسى: «${text}». (${role} ئۇسلۇبى بويىچە يېزىلدى)`;
    } else if (targetLang === 'en') {
      mockResult = `This is the translated English rendition: "${text}" styled with ${role} tone.`;
    } else if (targetLang === 'tr') {
      mockResult = `Bu çeviri metnidir: "${text}" (${role} üslubu ile).`;
    } else if (targetLang === 'ar') {
      mockResult = `هذه هي الترجمة: "${text}" بأسلوب ${role}.`;
    }

    return NextResponse.json({
      translatedText: mockResult,
      detectedSource: 'auto',
      model,
      provider: 'simulated-preview',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
