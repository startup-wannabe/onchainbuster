import { CMC_API_BASE_URL, CMC_API_KEY } from '@/constants/web3Infra';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokens = searchParams.get('tokens');
  const query = `symbol=${tokens}&aux=tags,date_added`;

  const res = await fetch(
    `${CMC_API_BASE_URL}/v1/cryptocurrency/quotes/latest?${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.40.0',
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
      },
    },
  );
  const data = await res.json();
  // console.log('=== res ', data);
  return Response.json({ data });
}
