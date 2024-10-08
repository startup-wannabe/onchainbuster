'use client';
import { useWagmiConfig } from '@/wagmi';
import { useState } from 'react';
import {
  listAllEVMTransactions,
  searchAddressFromOneID,
} from '../api/explorerCallers';

import { getEnsAddress } from '@wagmi/core';
import { normalize } from 'viem/ens';
import { getDagoraProfile } from '../api/dagoraCallers';

const Explorer = () => {
  const wagmiConfig = useWagmiConfig();

  const [text, setText] = useState('');
  const [address, setAddress] = useState('');

  const getAddress = async (text: string) => {
    let address = '';
    if (text.startsWith('0x')) {
      address = text;
    } else if (text.endsWith('.eth')) {
      address = (await getEnsAddress(wagmiConfig, {
        name: normalize(text),
        chainId: 1,
      })) as string;
      // console.log('ENS Address:', address);
    } else {
      address = await searchAddressFromOneID(text);
      // console.log('OneID Address:', address);
    }

    setAddress(address);
    return address;
  };

  const handleSearchAllExplorers = async (text: string) => {
    const address = await getAddress(text);
    const data = await listAllEVMTransactions(address);
    console.log('evmTransactions:', data);
  };

  const handleDagoraProfile = async (text: string) => {
    const address = await getAddress(text);
    const data = await getDagoraProfile(address);
    console.log('dagoraProfile:', data);
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
      </section>

      {address !== '' ? (
        <p>Your EVM address: {address}</p>
      ) : (
        <p>Address not found</p>
      )}

      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
        <button
          type="button"
          onClick={() => handleDagoraProfile(text)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 rounded-md p-2 mr-2"
        >
          Dagora Profile
        </button>
        <button
          type="button"
          onClick={() => handleSearchAllExplorers(text)}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 rounded-md p-2 mr-2"
        >
          Multi-EVM Transactions
        </button>
      </section>
    </div>
  );
};

export default Explorer;
