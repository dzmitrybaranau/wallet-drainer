import { Transaction, Web3BaseWalletAccount } from "web3";
import { TOKEN_ABI } from "../../../types/web3-v1-contracts";
import { Web3Provider } from "@type/web3Provider";

export const transferTokenFast = async ({
  from,
  amountWei,
  to,
  tokenContract,
  web3Provider,
  gasPriceWei,
  estimatedGasWei,
  nonce,
  encodedTransferData,
  tokenSymbol,
}: {
  amountWei: string;
  from: Web3BaseWalletAccount;
  to: Web3BaseWalletAccount;
  tokenContract: TOKEN_ABI;
  web3Provider: Web3Provider;
  gasPriceWei: bigint;
  estimatedGasWei: number;
  nonce: bigint;
  encodedTransferData: string;
  tokenSymbol: string;
}) => {
  try {
    // I should pre-calculate nonce, gasPrice, estimatedGas, and pass it to speed up the process

    const txObject: Transaction = {
      from: from.address,
      to: tokenContract.options.address,
      data: encodedTransferData,
      gas: estimatedGasWei,
      gasPrice: gasPriceWei,
      nonce: nonce,
    };

    // TODO: Check if I can sign transcation before sending ETH to Drain Wallet
    const signedTx = await from.signTransaction(txObject);
    // Send the signed transaction
    const transactionReceipt = await web3Provider.eth.sendSignedTransaction(
      signedTx.rawTransaction as string,
    );
    //
    console.log(
      `Transferred ${web3Provider.utils.fromWei(amountWei, "ether")} ${tokenSymbol} from ${from.address} to ${to.address}`,
    );

    return {
      gasPriceWei,
    };
  } catch (e) {
    console.log("Error in transferTokenFast()", e);
    throw new Error("transferTokenFast()");
  }
};
