import { NextResponse } from 'next/server';

export const runtime = 'edge';


interface GeminiResponse {
  candidates?: [
    {
      content: {
        parts: [
          {
            text: string;
          }
        ];
      };
    }
  ];
}
interface RequestBody {
  prompt: string;
  apiKey: string;
  agent: 'gemini' | 'openai';
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{
      parts: [{
        text: `Based on the following description, generate a regular expression (regex). Only return the regex pattern itself, with no explanations, backticks, or language identifiers.\n\nDescription: "${prompt}"`
      }]
    }],
    generationConfig: {
      temperature: 0.1,
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
    console.error("Gemini API Error:", errorBody);
    throw new Error(`Gemini API failed: ${errorBody}`);
  }

  const data = await response.json() as GeminiResponse;
  const regex = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!regex) {
    throw new Error('Failed to generate regex from the AI.');
  }
  return regex.trim();
}

export async function POST(request: Request) {
  try {
    const { prompt, apiKey, agent } = await request.json() as RequestBody;
    if (!prompt || !apiKey || !agent) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    let regex: string;
    
    // For now, only Gemini is implemented for this task
    if (agent === 'gemini') {
      regex = await callGemini(prompt, apiKey);
    } else {
      return NextResponse.json({ error: 'Invalid AI agent specified.' }, { status: 400 });
    }

    return NextResponse.json({ regex });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
