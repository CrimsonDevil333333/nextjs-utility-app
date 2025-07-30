import { NextResponse } from 'next/server';
// Note: The 'dns/promises' module is not available in the Edge runtime.
// We will need to use a third-party API for DNS lookups.
// A popular choice is Google's DNS over HTTPS API.

export const runtime = 'edge'; // Required for Cloudflare Pages

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const type = searchParams.get('type') || 'A';

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
    if (!response.ok) {
        throw new Error('Failed to fetch DNS data from Google API.');
    }
    const data = await response.json() as { Status: number; Answer?: any[] };

    if (data.Status !== 0 || !data.Answer) {
        return NextResponse.json({ error: `No ${type} records found for ${domain}` }, { status: 404 });
    }

    // Format the response to match what the frontend expects
    const records = data.Answer.map((ans: any) => {
        switch (type.toUpperCase()) {
            case 'MX':
                const parts = ans.data.split(' ');
                return { priority: parseInt(parts[0], 10), exchange: parts[1] };
            case 'TXT':
                return [ans.data.replace(/"/g, '')];
            default:
                return ans.data;
        }
    });

    return NextResponse.json(records);
  } catch (error: any) {
    console.error('DNS lookup error:', error);
    return NextResponse.json({ error: `Failed to lookup DNS records for ${domain}` }, { status: 500 });
  }
}
