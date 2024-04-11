import { Transaction, Web3BaseWalletAccount } from "web3";
import { Web3Provider } from "@type/web3Provider";
import { estimateMaxEthPossibleToSend } from "./estimateMaxEthPossibleToSend";

export async function sendEth({
  valueETH,
  to,
  from,
  web3Provider,
  fromWalletNonce,
  gasPriceWei,
}: {
  from: Web3BaseWalletAccount;
  valueETH: string | "MAX";
  to: Web3BaseWalletAccount;
  web3Provider: Web3Provider;
  fromWalletNonce?: bigint;
  gasPriceWei?: bigint;
}) {
  // check if valueETH is a float number
  if (valueETH !== "MAX" && Number.isInteger(Number(valueETH))) {
    throw new Error("sendEth(), Check if you send ETH and not Wei");
  }
  try {
    let valueInWei;
    if (valueETH === "MAX") {
      const { maxTransferableEth } = await estimateMaxEthPossibleToSend({
        web3Provider,
        from,
        to,
        gasPriceWei,
      });
      valueInWei = web3Provider.utils.toWei(maxTransferableEth, "ether");
      console.log(`Maximum transferable amount: ${maxTransferableEth} ETH`);

      if (maxTransferableEth === "0.") {
        throw new Error("No ETH to send");
      }
    } else {
      valueInWei = web3Provider.utils.toWei(valueETH, "ether");
    }

    let nonce;
    if (fromWalletNonce) {
      nonce = fromWalletNonce;
    } else {
      nonce = await web3Provider.eth.getTransactionCount(from.address);
    }

    let gasPrice;
    if (gasPriceWei) {
      gasPrice = gasPriceWei;
    } else {
      gasPrice = await web3Provider.eth.getGasPrice();
    }
    const gas = await web3Provider.eth.estimateGas({
      from: from.address,
      to: to.address,
      value: valueInWei,
    });

    const tx: Transaction = {
      from: from.address,
      to: to.address,
      value: valueInWei,
      nonce,
      gas,
      gasPrice,
    };

    const signedTransaction = await from.signTransaction(tx);

    // No need to wait for receipt since we need to outperform the other bots
    await web3Provider.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );
    console.log(
      `Sent ${web3Provider.utils.fromWei(valueInWei, "ether")} ETH from ${from.address} to ${to.address}`,
    );

    return { previousNonce: nonce, gasPriceWei: gasPrice };
  } catch (e) {
    console.log("sendEth() ", e);
    throw new Error("sendEth() " + e);
  }
}
