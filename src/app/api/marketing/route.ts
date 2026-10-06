import { NextRequest, NextResponse } from 'next/server';
import { callAIModel } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      topic,
      platform = 'tiktok',
      tone = 'hook',
      model = 'google/gemini-3.8-flash',
      apiKey,
      openRouterApiKey,
      geminiApiKey,
    } = body;

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const platformPrompts: Record<string, string> = {
      tiktok: 'TikTok & Instagram Reels: punchy 3-second hook, fast-paced engaging script, and viral hashtags.',
      instagram: 'Instagram Carousel/Photo: aesthetic lifestyle storytelling caption, emojis, benefits, and niche hashtags.',
      telegram: 'Telegram & Social Channel: concise broadcast announcement with bullet points and clear call to action.',
      ecommerce: 'E-commerce Product Listing: persuasive copywriting addressing customer pain points, features, and buy-now trigger.',
    };

    const systemPrompt = `You are a top 1% social media marketing copywriter and conversion strategist.
Platform target: ${platformPrompts[platform] || platformPrompts.tiktok}.
Tone & Angle: ${tone}.
Language: Uyghur (ئۇيغۇر ئەرەب يېزىقى) with optional English tags.
Structure the response cleanly with:
1. 🎯 كىشىنى جەلپ قىلغۇچى ماۋزۇ (Hook Headline)
2. 📝 تەپسىلىي ئىلان مەزمۇنى (Body Copy)
3. 🚀 ھەرىكەتكە چاقىرىش (Call to Action / CTA)
4. 🏷 ئاۋات بەلگىلەر (#Hashtags)`;

    const userPrompt = `Create an exceptional promotional social media post about:\n\n${topic}`;

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

      if (result?.text) {
        return NextResponse.json({
          content: result.text.trim(),
          model: result.model,
          provider: result.provider,
        });
      }
    } catch (apiErr: any) {
      console.warn('Marketing API call error:', apiErr);
    }

    // High quality simulation fallback
    const mockPost = `🎯 【كىشىنى جەلپ قىلغۇچى ماۋزۇ】
«${topic}» ھەققىدە سىز تېخى بىلمەيدىغان ئەڭ چوڭ سىر! سۈرئەت ۋە نەتىجىنىڭ مۇكەممەل بىرىكىشى.

📝 【ئىلان مەزمۇنى】
كۈندىلىك تۇرمۇشىڭىز ۋە تىجارىتىڭىزدە ۋاقىت تېجەپ، ئەڭ ئۈنۈملۈك نەتىجىگە ئېرىشىشنى خالامسىز؟ مەزكۇر تاللاش دەل سىز ئىزدەۋاتقان ئىشەنچلىك پۇرسەت.
• تېز ۋە ئىشەنچلىك سۈپەت
• نەپىس لايىھە ۋە كۈچلۈك ئىقتىدار
• زامانىۋى سۈنئىي ئىدراك قولايلىقى

🚀 【ھەرىكەتكە چاقىرىش (CTA)】
تۆۋەندىكى ئۇلىنىشنى بېسىپ ھازىرلا بىرىنچى قەدەمنى بېسىڭ! كۆپچىلىككە ئۈلگە بولۇڭ.

🏷 【ئاۋات بەلگىلەر】
#ئۇيغۇرچە #سۈنئىي_ئىدراك #ماركېتىنگ #تەشۋىقات #TikTokUyghur #BusinessAI`;

    return NextResponse.json({
      content: mockPost,
      model,
      provider: 'simulated-marketing',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
