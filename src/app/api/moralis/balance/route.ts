import { MORALIS_API_BASE_URL, MORALIS_API_KEY } from '@/constants/web3Infra';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chain = searchParams.get('chain');
  const limit = searchParams.get('limit');
  const cursor = searchParams.get('cursor');

  const query = `chain=${chain}&limit=${limit}&cursor=${cursor}&exclude_unverified_contracts=true`;

  const res = await fetch(
    `${MORALIS_API_BASE_URL}/v2.2/wallets/${address}/tokens?${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.40.0',
        'x-api-key': MORALIS_API_KEY,
      },
    },
  );
  const data = await res.json();
  console.log('=== res ', data);
  return Response.json({ data });
}
