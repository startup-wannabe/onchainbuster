import { CMC_API_BASE_URL, CMC_API_KEY } from '@/constants/web3Infra';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenList = searchParams.get('tokenList');

  const query = `symbol=${tokenList}&aux=tags`;

  const res = await fetch(
    `${CMC_API_BASE_URL}/v1/cryptocurrency/quotes/latest?${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.40.0',
        'x-api-key': CMC_API_KEY,
      },
    },
  );
  const data = await res.json();
  // console.log('=== res ', data);
  return Response.json({ data });
}
