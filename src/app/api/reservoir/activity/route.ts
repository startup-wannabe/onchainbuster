import { RESERVOIR_API_KEY } from '@/constants/nftInfra';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chain = searchParams.get('chain');
  const continuation = searchParams.get('continuation');
  const limit = searchParams.get('limit');

  let chainSuffix = '';

  switch (chain?.toUpperCase()) {
    case 'ETH': {
      break;
    }
    case 'BASE': {
      chainSuffix += '-base';
      break;
    }
    case 'ARB': {
      chainSuffix += '-arbitrum';
      break;
    }
    case 'OP': {
      chainSuffix += '-optimism';
      break;
    }
    case 'BSC': {
      chainSuffix += '-bsc';
      break;
    }
    default:
      return Response.json({ error: 'Invalid chain type' }, { status: 400 });
  }

  const reservoirBaseUrl = `https://api${chainSuffix}.reservoir.tools`;

  let query = '';
  if (continuation !== '') {
    query = `users=${address}&continuation=${continuation}&limit=${limit}&excludeSpam=true`;
  } else {
    query = `users=${address}&limit=${limit}&excludeSpam=true`;
  }

  const res = await fetch(`${reservoirBaseUrl}/users/activity/v6?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PostmanRuntime/7.40.0',
      'x-api-key': RESERVOIR_API_KEY,
    },
  });
  const data = await res.json();
  // console.log('=== res ', data);
  return Response.json({ data });
}
