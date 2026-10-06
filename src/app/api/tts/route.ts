import { NextRequest, NextResponse } from 'next/server';
import { callAIModel } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      voice = 'male',
      speed = 1.0,
      model = 'google/gemini-3.8-flash',
      apiKey,
      openRouterApiKey,
      geminiApiKey,
    } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Step 1: Perform phonetic & intonation enhancement if using Gemini/OpenRouter
    let phoneticGuide = text;
    if (!model.startsWith('browser-native:')) {
      try {
        const refineRes = await callAIModel({
          model: model.startsWith('gemini') ? model : 'google/gemini-3.8-flash',
          messages: [
            {
              role: 'system',
              content:
                'You are a phonetics and speech intonation expert. Format the text for clear, natural, expressive speech synthesis, preserving language tone and pronunciation marks where helpful.',
            },
            { role: 'user', content: text },
          ],
          apiKey,
          openRouterApiKey,
          geminiApiKey,
        });
        if (refineRes?.text) phoneticGuide = refineRes.text;
      } catch (e) {
        console.warn('TTS phonetic optimization warning:', e);
      }
    }

    return NextResponse.json({
      text,
      phoneticGuide,
      voice,
      speed,
      model,
      status: 'ready',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
