import { NextRequest, NextResponse } from 'next/server';
import { callAIModel } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      model = 'google/gemini-3.8-flash',
      apiKey,
      openRouterApiKey,
      geminiApiKey,
    } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Default Uyghur & Multilingual Persona instruction if not present
    const hasSystem = messages.some((m: any) => m.role === 'system');
    const enrichedMessages = hasSystem
      ? messages
      : [
          {
            role: 'system',
            content:
              'You are a polite, helpful, and highly intelligent AI assistant proficient in Uyghur (ئۇيغۇرچە), English, Turkish, and Arabic. When the user speaks in Uyghur, reply in natural, fluent Uyghur Arabic script. Follow formatting and provide well-structured answers.',
          },
          ...messages,
        ];

    try {
      const result = await callAIModel({
        model,
        messages: enrichedMessages,
        apiKey,
        openRouterApiKey,
        geminiApiKey,
      });

      if (result) {
        return NextResponse.json({
          reply: result.text,
          model: result.model,
          provider: result.provider,
        });
      }
    } catch (apiErr: any) {
      console.error('API call error in chat:', apiErr);
      return NextResponse.json({ error: apiErr.message || 'API call failed' }, { status: 500 });
    }

    // Fallback response if no API key is provided
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const simulatedReply = `ئەسسالامۇئەلەيكۇم! سىزنىڭ تېمىڭىز («${lastUserMessage.slice(0, 50)}...») قوبۇل قىلىندى.\n\nسىز تاللىغان مودېل: \`${model}\`.\n\nتېخىمۇ چوڭقۇر ۋە رەسمىي سۈنئىي ئىدراك چىقىرىشى ئۈچۈن، «تەڭشەك (Settings)» بېتىدىن OpenRouter ياكى Gemini API ئاچقۇچىڭىزنى كىرگۈزسىڭىز، سىستېما دەرھال ئەڭ يۇقىرى سۈرئەتتە رەسمىي مودېللارنى چاقىرىپ ئىشلەيدۇ.`;

    return NextResponse.json({
      reply: simulatedReply,
      model,
      provider: 'simulated-preview',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
