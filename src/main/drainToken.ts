import { Web3BaseWalletAccount } from "web3";
import { Web3Provider } from "@type/web3Provider";
import EarlyZerolendAbiJson from "../contracts/EarlyZerolend.json";
import BN from "bn.js";
import {
  estimateMaxEthPossibleToSend,
  getEthBalance,
  getSendEthBatch,
  sendEth,
} from "@utils/ethUtils";
import {
  estimateTokenTransfer,
  getSmartContract,
  getTokenBalance,
  transferTokenFast,
} from "@utils/tokenUtils";
import { getTransferTokenBatchRequest } from "@utils/tokenUtils/getTransferTokenBatchRequest";
import { TOKEN_ABI } from "@type/web3-v1-contracts";

export async function drainToken({
  drainWallet,
  masterWallet,
  tokenAddress,
  tokenSymbol,
  web3Provider,
}: {
  masterWallet: Web3BaseWalletAccount;
  drainWallet: Web3BaseWalletAccount;
  tokenAddress: string;
  tokenSymbol: string;
  web3Provider: Web3Provider;
}) {
  try {
    const batch = new web3Provider.BatchRequest();

    // Get token contract
    const tokenContract = getSmartContract<TOKEN_ABI>({
      contractAddress: tokenAddress,
      web3Provider,
      abiJSON: EarlyZerolendAbiJson,
    });

    // Get token balance of drain wallet
    const { tokenBalanceWei, tokenBalanceEth } = await getTokenBalance({
      tokenContract,
      address: drainWallet.address,
      tokenSymbol,
      web3Provider,
    });
    console.log({
      tokenBalanceWei,
      tokenBalanceEth,
    });
    if (Number(tokenBalanceWei) === 0) {
      console.log("Token balance is 0");
      return;
    }

    // Get gas fee to drain token
    const {
      calculatedTokenTransferGasFeeWei,
      calculatedTokenTransferGasFeeInEth,
      gasPriceWei,
      estimatedGasWei,
    } = await estimateTokenTransfer({
      tokenAmountWei: tokenBalanceWei,
      from: drainWallet,
      to: masterWallet,
      web3Provider,
      tokenContract,
    });

    console.log({
      calculatedTokenTransferGasFeeWei,
      calculatedTokenTransferGasFeeInEth,
    });

    // Get drain wallet balance to estimate how much need to send for drain
    const { ethBalanceWei: drainWalletBalanceWei, ethBalanceEth } =
      await getEthBalance({
        address: drainWallet.address,
        web3Provider,
      });
    console.log({ drainWalletBalanceWei, ethBalanceEth });

    let drainWalletNonce = await web3Provider.eth.getTransactionCount(
      drainWallet.address,
    );

    // Drain if enough balance
    if (
      new BN(drainWalletBalanceWei).gt(
        new BN(calculatedTokenTransferGasFeeWei),
      ) ||
      new BN(drainWalletBalanceWei).eq(new BN(calculatedTokenTransferGasFeeWei))
    ) {
      console.log("Drain wallet has enough eth to make the transfer");
      const encodedTransferData = tokenContract.methods
        .transfer(masterWallet.address, tokenBalanceWei)
        .encodeABI();
      await transferTokenFast({
        to: masterWallet,
        from: drainWallet,
        amountWei: tokenBalanceWei,
        tokenContract,
        web3Provider,
        gasPriceWei,
        estimatedGasWei,
        nonce: drainWalletNonce,
        encodedTransferData,
        tokenSymbol,
      });
      return;
    }

    // Calculate gas price to make tokens transfer
    const ethToSendToDrainWalletWei = new BN(calculatedTokenTransferGasFeeWei)
      .sub(new BN(drainWalletBalanceWei))
      .toString();

    const ethToSend = web3Provider.utils.fromWei(
      ethToSendToDrainWalletWei,
      "ether",
    );

    const encodedTokenTransferData = tokenContract.methods
      .transfer(masterWallet.address, tokenBalanceWei)
      .encodeABI();

    await sendEth({
      from: masterWallet,
      web3Provider,
      to: drainWallet,
      valueETH: ethToSend,
    });

    const { transferTokenJsonRpcBatchRequest } =
      await getTransferTokenBatchRequest({
        from: drainWallet,
        tokenContract,
        gasPriceWei,
        estimatedGasWei,
        encodedTransferData: encodedTokenTransferData,
        fromWalletNonce: drainWalletNonce,
      });
    drainWalletNonce += BigInt(1);
    batch
      .add(transferTokenJsonRpcBatchRequest)
      .then(() => {
        console.log(`Sent ${tokenSymbol} to Master`);
      })
      .catch(() => {
        const encodedTransferData = tokenContract.methods
          .transfer(masterWallet.address, tokenBalanceWei)
          .encodeABI();
        transferTokenFast({
          to: masterWallet,
          from: drainWallet,
          amountWei: tokenBalanceWei,
          tokenContract,
          web3Provider,
          gasPriceWei,
          estimatedGasWei,
          nonce: drainWalletNonce,
          encodedTransferData,
          tokenSymbol,
        });
        console.log("Error in batch.add(transferTokenJsonRpcBatchRequest)");
      });

    // Send back rest of ETH
    const { maxTransferableEth, maxTransferableWei } =
      await estimateMaxEthPossibleToSend({
        web3Provider,
        from: drainWallet,
        to: masterWallet,
        gasPriceWei,
      });

    const estimatedGasSendFromDrainToMaster =
      await web3Provider.eth.estimateGas({
        from: drainWallet.address,
        to: masterWallet.address,
        value: maxTransferableWei.toNumber(),
      });

    const { sendEthBatchRequestJsonRpc: drainSendEthBatchRequestJsonRpc } =
      await getSendEthBatch({
        from: drainWallet,
        to: masterWallet,
        fromWalletNonce: drainWalletNonce,
        valueWei: web3Provider.utils.toWei(maxTransferableEth, "ether"),
        estimatedGasWei: estimatedGasSendFromDrainToMaster,
        gasPriceWei,
      });

    const drainSendEthBackBatchRequestPromise = batch.add(
      drainSendEthBatchRequestJsonRpc,
    );
    drainSendEthBackBatchRequestPromise
      .then(() => {
        console.log(`Sent ${maxTransferableEth} ETH back to Master`);
      })
      .catch((e) => {
        console.log("Error in drainSendEthBatchRequestPromise", e);
      });

    await batch.execute({ timeout: 10000 }).catch((err) => {
      console.log("Error in batch.execute()", err);
      throw new Error("batch.execute()");
    });
  } catch (e) {
    console.log("Error in drainToken()", e);
    throw new Error("drainToken()");
  }
}
