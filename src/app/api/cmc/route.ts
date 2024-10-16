import { CMC_API_BASE_URL, CMC_API_KEY } from '@/constants/web3Infra';
import cmcIDlist from '@data/cmcIDList.json';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokens = searchParams.get('tokens');

  const tokenSymbolList = tokens?.split(',') || [];
  const tokenIdList = tokenSymbolList.map(
    (symbol) =>
      (cmcIDlist as TCMCStaticMap).data.find((token) => token.symbol === symbol)
        ?.id || '',
  );

  const query = `id=${tokenIdList.filter(Boolean).join(',')}&aux=tags,date_added`;

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
