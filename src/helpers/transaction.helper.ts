export const castVICToEVMTransactionType = (
  VicscanTransactions: TVicscanTransaction[],
): TEVMScanTransaction[] => {
  // Cast VicscanTransactions to the format of EVMScanTransactions
  const castedEVMTransactions: TEVMScanTransaction[] = VicscanTransactions.map(
    (vTx) =>
      ({
        blockNumber: vTx.blockNumber.toString(),
        blockHash: vTx.blockHash,
        timeStamp: vTx.timestamp.toString(),
        hash: vTx.hash,
        nonce: vTx.nonce.toString(),
        transactionIndex: vTx.transactionIndex.toString(),
        from: vTx.from,
        to: vTx.to,
        value: vTx.value,
        gas: vTx.gas.toString(),
        gasPrice: vTx.gasPrice.toString(),
        input: vTx.input,
        methodId: '', // Vicscan doesn't provide this
        functionName: '', // Vicscan doesn't provide this
        contractAddress: vTx.contractAddress || '',
        cumulativeGasUsed: '',
        txreceipt_status: vTx.status,
        gasUsed: vTx.gasUsed.toString(),
        confirmations: '',
        isError: '',
      }) as TEVMScanTransaction,
  );

  return castedEVMTransactions;
};

export const castVICToEVMTTokenActivityType = (
  VicscanTokenActivity: TVicscanTokenActivity[],
): TEVMScanTokenActivity[] => {
  const castedEVMTokenActivities: TEVMScanTokenActivity[] =
    VicscanTokenActivity.map(
      (vTx) =>
        ({
          blockNumber: vTx.blockNumber.toString(),
          timeStamp: vTx.timestamp.toString(),
          hash: '',
          nonce: '',
          blockHash: vTx.blockHash,
          from: vTx.from,
          contractAddress: '',
          to: vTx.to,
          value: vTx.value,
          tokenName: vTx.tokenName,
          tokenSymbol: vTx.tokenSymbol,
          tokenDecimal: vTx.tokenDecimals.toString(),
          transactionIndex: vTx.transactionIndex.toString(),
          // Oke zero-gas promotion
          gas: '',
          gasPrice: '',
          gasUsed: '',
          cumulativeGasUsed: '',
          input: '',
          confirmations: '',
        }) as TEVMScanTokenActivity,
    );

  return castedEVMTokenActivities;
};
