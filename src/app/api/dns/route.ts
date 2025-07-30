import { NextResponse } from 'next/server';
import dns from 'dns/promises';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const type = searchParams.get('type') || 'A';

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  try {
    let records;
    switch (type.toUpperCase()) {
      case 'A':
        records = await dns.resolve4(domain);
        break;
      case 'AAAA':
        records = await dns.resolve6(domain);
        break;
      case 'MX':
        records = await dns.resolveMx(domain);
        break;
      case 'TXT':
        records = await dns.resolveTxt(domain);
        break;
      case 'NS':
        records = await dns.resolveNs(domain);
        break;
      case 'CNAME':
        records = await dns.resolveCname(domain);
        break;
      default:
        return NextResponse.json({ error: 'Invalid record type' }, { status: 400 });
    }
    return NextResponse.json(records);
  } catch (error: any) {
    console.error('DNS lookup error:', error);
    // Provide a more user-friendly error message
    if (error.code === 'ENOTFOUND') {
        return NextResponse.json({ error: `Domain not found: ${domain}` }, { status: 404 });
    }
    if (error.code === 'ENODATA') {
        return NextResponse.json({ error: `No ${type} records found for ${domain}` }, { status: 404 });
    }
    return NextResponse.json({ error: `Failed to lookup DNS records for ${domain}` }, { status: 500 });
  }
}
