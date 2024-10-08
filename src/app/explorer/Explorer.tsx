'use client';
import { useState } from 'react';
import { listEtherscanTransactions, listVicTransactions } from '../api/callers';

const Explorer = () => {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ETH');

  const handleSearch = async (address: string, chain: string) => {
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
          placeholder="0x..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
          onClick={() => handleSearch(address, chain)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
        >
          Search
        </button>
      </section>
    </div>
  );
};

export default Explorer;
