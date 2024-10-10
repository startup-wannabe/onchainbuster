import { VICSCAN_API_BASE_URL } from '@constants/explorers';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const account = searchParams.get('account');
  const offset = searchParams.get('offset');
  const limit = searchParams.get('limit');

  const query = `account=${account}&offset=${offset}&limit=${limit}`;

  const res = await fetch(`${VICSCAN_API_BASE_URL}/transaction/list?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PostmanRuntime/7.40.0',
    },
  });
  const data = await res.json();
  // console.log('=== res ', data);
  return Response.json({ data });
}
