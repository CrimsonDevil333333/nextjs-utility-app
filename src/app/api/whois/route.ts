export const runtime = "edge";

import { NextResponse } from 'next/server';
import whois from 'whois-json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  try {
    const results = await whois(domain);
    return NextResponse.json(results);
  } catch (error) {
    console.error('WHOIS lookup error:', error);
    return NextResponse.json({ error: `Failed to lookup domain: ${domain}` }, { status: 500 });
  }
}
