import { JsonRpcRequest, Transaction, Web3BaseWalletAccount } from "web3";

export async function getSendEthBatch({
  valueWei,
  to,
  from,
  fromWalletNonce,
  gasPriceWei,
  estimatedGasWei,
}: {
  from: Web3BaseWalletAccount;
  valueWei: string;
  to: Web3BaseWalletAccount;
  fromWalletNonce: bigint;
  gasPriceWei: bigint;
  estimatedGasWei: bigint;
}) {
  try {
    const tx: Transaction = {
      from: from.address,
      to: to.address,
      value: valueWei,
      nonce: fromWalletNonce,
      gas: estimatedGasWei,
      gasPrice: gasPriceWei,
    };

    const signedSendEthTransaction = await from.signTransaction(tx);

    const sendEthBatchRequestJsonRpc: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: fromWalletNonce.toString(),
      method: "eth_sendRawTransaction",
      params: [signedSendEthTransaction.rawTransaction],
    };

    return {
      sendEthBatchRequestJsonRpc,
    };
  } catch (e) {
    console.log("sendEth() ", e);
    throw new Error("sendEth() " + e);
  }
}
