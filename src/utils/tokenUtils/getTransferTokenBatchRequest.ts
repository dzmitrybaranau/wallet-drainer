import { JsonRpcRequest, Transaction, Web3BaseWalletAccount } from "web3";
import { TOKEN_ABI } from "../../../types/web3-v1-contracts";
import { Web3Provider } from "@type/web3Provider";

export const getTransferTokenBatchRequest = async ({
  from,
  tokenContract,
  gasPriceWei,
  estimatedGasWei,
  encodedTransferData,
  fromWalletNonce,
}: {
  from: Web3BaseWalletAccount;
  tokenContract: TOKEN_ABI;
  gasPriceWei: bigint;
  estimatedGasWei: number;
  encodedTransferData: string;
  fromWalletNonce: bigint;
}) => {
  try {
    // I should pre-calculate nonce, gasPrice, estimatedGas, and pass it to speed up the process

    const txObject: Transaction = {
      from: from.address,
      to: tokenContract.options.address,
      data: encodedTransferData,
      gas: estimatedGasWei,
      gasPrice: gasPriceWei,
      nonce: fromWalletNonce,
    };

    // TODO: Check if I can sign transcation before sending ETH to Drain Wallet
    const signedTokenTransferTransactionBatchRequest =
      await from.signTransaction(txObject);

    const transferTokenJsonRpcBatchRequest: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: fromWalletNonce.toString(),
      method: "eth_sendRawTransaction",
      params: [signedTokenTransferTransactionBatchRequest.rawTransaction],
    };

    return {
      transferTokenJsonRpcBatchRequest,
    };
  } catch (e) {
    console.log("Error in transferTokenFast()", e);
    throw new Error("transferTokenFast()");
  }
};
