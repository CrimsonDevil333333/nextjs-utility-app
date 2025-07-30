import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface RequestBody {
  prompt: string;
  apiKey: string;
  agent: 'gemini' | 'openai'; 
}

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


export async function POST(request: Request) {
  try {
    const { prompt, apiKey, agent } = await request.json() as RequestBody;

    if (!prompt) return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    if (!apiKey) return NextResponse.json({ error: 'API key is required.' }, { status: 400 });
    if (!agent) return NextResponse.json({ error: 'AI agent is required.' }, { status: 400 });

    let colors: string[] = [];

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        parts: [{
          text: `Generate a color palette of 5 colors based on the following theme or mood: "${prompt}". The colors should be aesthetically pleasing and work well together. Provide the colors as an array of hex codes.`
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            colors: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          }
        }
      }
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

    // FIX 2: Assert the type of the API response data
    const data = await response.json() as GeminiResponse;
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (resultText) {
        const result: { colors: string[] } = JSON.parse(resultText);
        colors = result.colors;
    } else {
        throw new Error('Failed to generate a color palette from the AI.');
    }

    return NextResponse.json({ colors });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}