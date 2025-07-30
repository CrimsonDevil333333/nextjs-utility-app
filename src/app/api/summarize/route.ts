import { NextResponse } from 'next/server';

export const runtime = 'edge';

// --- Helper function for Gemini API call ---
async function callGemini(text: string, apiKey: string) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{
      parts: [{
        text: `Summarize the following text concisely, focusing on the main points. The summary should be easy to read and understand:\n\n---\n\n${text}`
      }]
    }],
    generationConfig: {
      temperature: 0.5,
      topK: 1,
      topP: 1,
      maxOutputTokens: 256,
    },
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
  const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!summary) {
    throw new Error('Failed to generate a summary from the Gemini API.');
  }
  return summary;
}

// --- Helper function for OpenAI API call ---
async function callOpenAI(text: string, apiKey: string) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const payload = {
    model: 'gpt-3.5-turbo', // Or another model like gpt-4
    messages: [
      { role: 'system', content: 'You are an expert summarizer. Your goal is to provide a concise summary of the given text, focusing on the main points.' },
      { role: 'user', content: text }
    ],
    temperature: 0.5,
    max_tokens: 256,
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
  const summary = data.choices?.[0]?.message?.content;

  if (!summary) {
    throw new Error('Failed to generate a summary from the OpenAI API.');
  }
  return summary;
}


export async function POST(request: Request) {
  try {
    const { text, apiKey, agent } = await request.json() as { text: string; apiKey: string; agent: string };

    if (!text) return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
    if (!apiKey) return NextResponse.json({ error: 'API key is required.' }, { status: 400 });
    if (!agent) return NextResponse.json({ error: 'AI agent is required.' }, { status: 400 });

    let summary;

    switch (agent) {
      case 'gemini':
        summary = await callGemini(text, apiKey);
        break;
      case 'openai':
        summary = await callOpenAI(text, apiKey);
        break;
      default:
        return NextResponse.json({ error: 'Invalid AI agent specified.' }, { status: 400 });
    }

    return NextResponse.json({ summary });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
