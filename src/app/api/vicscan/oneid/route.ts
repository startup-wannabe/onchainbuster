import { VICSCAN_API_BASE_URL } from '@constants/explorers';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');

  const res = await fetch(`${VICSCAN_API_BASE_URL}/oneid/search?text=${text}`, {
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