'use client';
import { useWagmiConfig } from '@/wagmi';
import { useState } from 'react';
import {
  listEtherscanTransactions,
  listVicTransactions,
  searchAddressFromOneID,
} from '../api/callers';

import { getEnsAddress } from '@wagmi/core';
import { normalize } from 'viem/ens';

const Explorer = () => {
  const wagmiConfig = useWagmiConfig();

  const [text, setText] = useState('');
  const [chain, setChain] = useState('ETH');
  const [address, setAddress] = useState('');

  const handleSearch = async (text: string, chain: string) => {
    let address = '';
    if (text.startsWith('0x')) {
      address = text;
    } else if (text.endsWith('.eth') || text.endsWith('.base.eth')) {
      address = (await getEnsAddress(wagmiConfig, {
        name: normalize(text),
        chainId: 1,
      })) as string;
      console.log('ENS Address:', address);
    } else {
      address = await searchAddressFromOneID(text);
      console.log('OneID Address:', address);
    }
    setAddress(address);

    let data: TEtherscanTransaction[] | TVicscanTransaction[];
    if (chain !== 'VIC') {
      data = await listEtherscanTransactions(address, chain);
    } else {
      data = await listVicTransactions(address);
    }
    console.log(chain, data);
  };

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px]">
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
        <input
          type="text"
          placeholder="EVM address 0x..., ENS, Basename, OneID"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mr-2 w-full"
        />
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mr-2"
        >
          <option value="ETH">Ethereum Mainnet</option>
          <option value="OP">Optimism</option>
          <option value="BASE">Base</option>
          <option value="BSC">Binance Smart Chain</option>
          <option value="VIC">Viction</option>
        </select>
        <button
          type="button"
          onClick={() => handleSearch(text, chain)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
        >
          Search
        </button>
      </section>

      {address !== '' ? (
        <p>Your EVM address: {address}</p>
      ) : (
        <p>Address not found</p>
      )}
    </div>
  );
};

export default Explorer;
