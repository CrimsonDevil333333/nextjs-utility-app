import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Required for Cloudflare Pages

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let ip = searchParams.get('ip');

  // If no IP is provided, get the client's IP from the request headers
  if (!ip) {
    ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    
    // For local development, you might not have these headers. Fallback to a known IP.
    if (!ip || ip === '::1' || ip.startsWith('127.')) {
        ip = '8.8.8.8'; // Google's DNS as a fallback for demo
    }
  }

  if (!ip) {
    return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
  }

  try {
    // Using a free, no-key-required API for geolocation
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation data.');
    }
    const data = await response.json() as { status: string; message?: string; [key: string]: any };
    if (data.status === 'fail') {
      return NextResponse.json({ error: data.message || 'Invalid IP address' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('IP Geolocation error:', error);
    return NextResponse.json({ error: `Failed to lookup IP: ${ip}` }, { status: 500 });
  }
}
