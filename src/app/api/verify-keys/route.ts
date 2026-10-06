import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { openRouterApiKey, geminiApiKey } = await req.json();

    const results: {
      openRouter?: { valid: boolean; message: string };
      gemini?: { valid: boolean; message: string };
    } = {};

    // 1. Verify OpenRouter API Key
    if (openRouterApiKey && openRouterApiKey.trim()) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${openRouterApiKey.trim()}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const label = data?.data?.label || 'Active';
          const limit = data?.data?.limit != null ? `$${data.data.limit}` : 'سۈكۈتتىكى';
          results.openRouter = {
            valid: true,
            message: `OpenRouter ئاچقۇچى ئىناۋەتلىك ۋە ئوڭۇشلۇق ئۇلاندى (${label}, Limit: ${limit})`,
          };
        } else {
          const errData = await res.json().catch(() => ({}));
          results.openRouter = {
            valid: false,
            message: errData?.error?.message || `ئۇلىنىش مەغلۇپ بولدى (${res.status}: ئاچقۇچنى قايتا تەكشۈرۈڭ)`,
          };
        }
      } catch (err: any) {
        results.openRouter = {
          valid: false,
          message: err?.message || 'تور ئۇلىنىشىدا خاتالىق كۆرۈلدى',
        };
      }
    }

    // 2. Verify Google Gemini API Key
    if (geminiApiKey && geminiApiKey.trim()) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey.trim()}`;
        const res = await fetch(geminiUrl, { method: 'GET' });

        if (res.ok) {
          results.gemini = {
            valid: true,
            message: 'Google Gemini API ئاچقۇچى ئىناۋەتلىك ۋە ئوڭۇشلۇق ئۇلاندى!',
          };
        } else {
          const errData = await res.json().catch(() => ({}));
          results.gemini = {
            valid: false,
            message: errData?.error?.message || `Gemini ئاچقۇچى ئىناۋەتسىز (${res.status})`,
          };
        }
      } catch (err: any) {
        results.gemini = {
          valid: false,
          message: err?.message || 'تور ئۇلىنىشىدا خاتالىق كۆرۈلدى',
        };
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
