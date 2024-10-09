export const lisTEVMScanTransactions = async (
  address: string,
  chain: string,
  action = 'txlist',
) => {
  if (address === '') {
    return [];
  }

  const data = await fetch(
    `/api/evmscan?address=${address}&chain=${chain}&action=${action}`,
    {
      method: 'GET',
    },
  );

  const res = await data.json();
  const evmResp: TEVMScanResponse = res.data;
  return evmResp.result;
};
