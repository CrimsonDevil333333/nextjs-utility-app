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
        text: `Based on the following request, write a SQL query. Only return the SQL code, with no explanations or markdown formatting.\n\nRequest: "${prompt}"`
      }]
    }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 512,
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
    throw new Error(`Gemini API failed with status ${response.status}`);
  }

  // FIX 1: Assert the type of the API response data
  const data = await response.json() as GeminiResponse;
  const sqlQuery = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!sqlQuery) {
    throw new Error('Failed to generate SQL query from the AI. The response was empty.');
  }
  
  // Clean up potential markdown formatting from the response
  return sqlQuery.trim().replace(/```sql\n|```/g, '');
}

export async function POST(request: Request) {
  try {
    // FIX 2: Assert the type of the request body
    const { prompt, apiKey, agent } = await request.json() as RequestBody;

    if (!prompt || !apiKey || !agent) {
      return NextResponse.json({ error: 'Missing required fields (prompt, apiKey, agent).' }, { status: 400 });
    }

    let sqlQuery: string;
    
    // For now, only Gemini is implemented for this task
    if (agent === 'gemini') {
      sqlQuery = await callGemini(prompt, apiKey);
    } else {
      return NextResponse.json({ error: 'Invalid AI agent specified. Only "gemini" is supported.' }, { status: 400 });
    }

    return NextResponse.json({ sqlQuery });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
