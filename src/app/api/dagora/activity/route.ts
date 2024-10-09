import { DAGORA_API_BASE_URL } from '@/constants/nftInfra';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const page = searchParams.get('page');
  const size = searchParams.get('size');
  const type = searchParams.get('type');

  const query = `address=${address}&page=${page}&size=${size}&type=${type}`;

  const res = await fetch(
    `${DAGORA_API_BASE_URL}/user/profile/activity?${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.40.0',
      },
    },
  );
  const data = await res.json();
  // console.log('=== res ', data);
  return Response.json({ data });
}
