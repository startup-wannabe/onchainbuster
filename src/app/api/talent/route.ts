import {
  TALENTPASSPORT_API_BASE_URL,
  TALENTPASSPORT_API_KEY,
} from '@/constants/web3Infra';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  const res = await fetch(
    `${TALENTPASSPORT_API_BASE_URL}/v2/passports/${address}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.40.0',
        'x-api-key': TALENTPASSPORT_API_KEY,
      },
    },
  );

  const data = await res.json();
  // console.log('=== res ', data);
  return Response.json({ data });
}
