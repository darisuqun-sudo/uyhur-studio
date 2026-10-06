import { NextRequest, NextResponse } from 'next/server';
import { callAIModel } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      aspectRatio = '1:1',
      style = 'realistic',
      model = 'google/gemini-3.8-flash',
      apiKey,
      openRouterApiKey,
      geminiApiKey,
    } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Step 1: Translate and enhance prompt to high quality English description
    let enhancedPrompt = prompt;
    try {
      const enhanceRes = await callAIModel({
        model: 'google/gemini-3.8-flash',
        messages: [
          {
            role: 'system',
            content:
              'You are a prompt engineer for image generation models (FLUX, Imagen 3, Midjourney). The user prompt might be in Uyghur or English. Translate and enrich it into an optimal English image generation prompt with vivid visual details, lighting, textures, composition, matching the requested style: ' +
              style +
              '. Output ONLY the enhanced prompt string without commentary.',
          },
          { role: 'user', content: prompt },
        ],
        apiKey,
        openRouterApiKey,
        geminiApiKey,
      });

      if (enhanceRes?.text) {
        enhancedPrompt = enhanceRes.text.trim();
      }
    } catch (e) {
      console.warn('Prompt enhancement step warning:', e);
    }

    // Calculate dimensions based on aspect ratio
    const ratioDimensions: Record<string, { width: number; height: number }> = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1280, height: 720 },
      '9:16': { width: 720, height: 1280 },
      '4:3': { width: 1024, height: 768 },
      '3:4': { width: 768, height: 1024 },
      '3:2': { width: 1200, height: 800 },
      '2:3': { width: 800, height: 1200 },
    };

    const dims = ratioDimensions[aspectRatio] || { width: 1024, height: 1024 };

    // Try OpenRouter image generation if user has OpenRouter API Key
    const effectiveOpenRouterKey =
      openRouterApiKey?.trim() ||
      (apiKey?.startsWith('sk-') ? apiKey.trim() : '') ||
      process.env.OPENROUTER_API_KEY ||
      '';

    if (effectiveOpenRouterKey && !model.startsWith('gemini-direct:')) {
      try {
        const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${effectiveOpenRouterKey}`,
            'HTTP-Referer': 'https://aqil-hub.local',
            'X-Title': 'Aqil AI Hub',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'user',
                content: `${enhancedPrompt}, style: ${style}, aspect ratio: ${aspectRatio}`,
              },
            ],
          }),
        });

        if (orRes.ok) {
          const data = await orRes.json();
          // Some image models on OpenRouter return markdown image or url in content or choice
          const content = data?.choices?.[0]?.message?.content || '';
          const urlMatch = content.match(/https?:\/\/[^\s)]+\.(png|jpg|jpeg|webp)/i);
          if (urlMatch) {
            return NextResponse.json({
              imageUrl: urlMatch[0],
              enhancedPrompt,
              dimensions: dims,
              model,
              provider: 'openrouter',
            });
          }
        }
      } catch (err) {
        console.warn('Direct OpenRouter image call failed, using high-res visual fallback:', err);
      }
    }

    // Beautiful dynamic image rendering via pollinations AI / unsplash seed
    const encodedPrompt = encodeURIComponent(
      `${enhancedPrompt}, ${style} style, 8k masterpiece photorealistic cinematography`
    );
    const generatedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dims.width}&height=${dims.height}&nologo=true&seed=${Math.floor(
      Math.random() * 100000
    )}`;

    return NextResponse.json({
      imageUrl: generatedUrl,
      enhancedPrompt,
      dimensions: dims,
      model,
      provider: 'generative-engine',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
