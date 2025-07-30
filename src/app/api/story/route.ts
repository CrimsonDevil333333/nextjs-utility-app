import { NextResponse } from 'next/server';

export const runtime = 'edge';

// --- Type Definitions ---

/**
 * Defines the structure for the response from the Gemini API.
 */
interface GeminiResponse {
  candidates?: [{
    content: {
      parts: [{
        text: string;
      }];
    };
  }];
}

/**
 * Defines the structure of the incoming request body.
 */
interface RequestBody {
  prompt: string;
  apiKey: string;
  agent: 'gemini' | 'openai';
}

/**
 * Calls the Gemini API to generate a story from a prompt, with retry logic.
 * @param prompt The user's prompt.
 * @param apiKey The user's Google AI API key.
 * @returns A promise that resolves to the generated story.
 */
async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{
      parts: [{
        text: `Write a short, creative story based on the following prompt. The story should be engaging and well-structured.\n\nPrompt: "${prompt}"`
      }]
    }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1024,
    },
  };

  // --- Retry Logic with Exponential Backoff ---
  let response: Response | undefined;
  const maxRetries = 3;
  let attempt = 0;
  let delay = 1000; // Start with a 1-second delay

  while (attempt < maxRetries) {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // If the request is successful or it's a client error (4xx), we don't retry.
    if (response.ok || (response.status >= 400 && response.status < 500)) {
      break;
    }

    // If it's a server error (5xx), wait and retry.
    console.log(`Attempt ${attempt + 1} failed with status ${response.status}. Retrying in ${delay}ms...`);
    await new Promise(res => setTimeout(res, delay));
    delay *= 2; // Double the delay for the next attempt
    attempt++;
  }

  if (!response || !response.ok) {
    const errorBody = await response?.text();
    throw new Error(`Gemini API failed after ${maxRetries} attempts. Last error: ${errorBody}`);
  }

  const data = await response.json() as GeminiResponse;
  const story = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!story) {
    throw new Error('Failed to generate a story from the AI.');
  }
  return story.trim();
}

export async function POST(request: Request) {
  try {
    const { prompt, apiKey, agent } = await request.json() as RequestBody;
    if (!prompt || !apiKey || !agent) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    let story: string;
    
    // For now, only Gemini is implemented for this task
    if (agent === 'gemini') {
      story = await callGemini(prompt, apiKey);
    } else {
      return NextResponse.json({ error: 'Invalid AI agent specified.' }, { status: 400 });
    }

    return NextResponse.json({ story });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
