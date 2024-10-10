export const unionTransactionType = (
  EVMScanTransactions: TEVMScanTransaction[],
  VicscanTransactions: TVicscanTransaction[],
) => {
  // Cast VicscanTransactions to the format of EVMScanTransactions
  const castVicscanTransactions: TEVMScanTransaction[] =
    VicscanTransactions.map(
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

  // Combine the EVMScanTransactions with the cast VicscanTransactions
  const unionTransactions: TEVMScanTransaction[] = [
    ...EVMScanTransactions,
    ...castVicscanTransactions,
  ];

  return unionTransactions;
};
