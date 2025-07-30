import { NextResponse } from 'next/server';

export const runtime = 'edge';

// --- Helper function for Gemini API call ---
async function callGemini(text: string, targetLang: string, apiKey: string) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{
      parts: [{
        text: `Translate the following text to ${targetLang}:\n\n---\n\n${text}`
      }]
    }],
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Gemini API Error:', errorBody);
    throw new Error(`Gemini API failed with status: ${response.status}`);
  }

  const data = await response.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  };
  const translation = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!translation) {
    throw new Error('Failed to generate a translation from the Gemini API.');
  }
  return translation;
}

// --- Helper function for OpenAI API call ---
async function callOpenAI(text: string, targetLang: string, apiKey: string) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: `You are an expert translator. Translate the user's text to ${targetLang}.` },
      { role: 'user', content: text }
    ],
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('OpenAI API Error:', errorBody);
    throw new Error(`OpenAI API failed with status: ${response.status}`);
  }

  const data = await response.json() as {
    choices?: { message?: { content?: string } }[]
  };
  const translation = data.choices?.[0]?.message?.content;

  if (!translation) {
    throw new Error('Failed to generate a translation from the OpenAI API.');
  }
  return translation;
}


export async function POST(request: Request) {
  try {
    const { text, targetLang, apiKey, agent } = await request.json() as { text: string; targetLang: string; apiKey: string; agent: string };

    if (!text) return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
    if (!targetLang) return NextResponse.json({ error: 'Target language is required.' }, { status: 400 });
    if (!apiKey) return NextResponse.json({ error: 'API key is required.' }, { status: 400 });
    if (!agent) return NextResponse.json({ error: 'AI agent is required.' }, { status: 400 });

    let translation;

    switch (agent) {
      case 'gemini':
        translation = await callGemini(text, targetLang, apiKey);
        break;
      case 'openai':
        translation = await callOpenAI(text, targetLang, apiKey);
        break;
      default:
        return NextResponse.json({ error: 'Invalid AI agent specified.' }, { status: 400 });
    }

    return NextResponse.json({ translation });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
