import {
  ETHERSCAN_API_BASE_URL,
  ETHERSCAN_API_KEY,
} from '@constants/explorers';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const action = searchParams.get('action');

  const query = `module=account&action=${action}&apikey=${ETHERSCAN_API_KEY}&address=${address}`;

  const res = await fetch(`${ETHERSCAN_API_BASE_URL}?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PostmanRuntime/7.40.0',
    },
  });
  const data = await res.json();
  console.log('=== res ', data);
  return Response.json({ data });
}
