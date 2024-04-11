import { Web3BaseWalletAccount } from "web3";
import {
  Web3Provider,
} from "@type/web3Provider";
import BN from "bn.js";
import { getEthBalance } from "../chains/eth/eth_chain";
import { sendEth } from "@utils/ethUtils";
import {estimateTokenTransfer, getTokenBalance, getTokenContract, transferTokenFast} from "@utils/tokenUtils";

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
    // Get token contract
    const tokenContract = getTokenContract({
      contractAddress: tokenAddress,
      web3Provider,
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
    const {
      ethBalanceWei: drainWalletBalanceWei,
      ethBalanceEth: drainWalletBalanceETH,
    } = await getEthBalance({ address: drainWallet.address, web3Provider });
    console.log({ drainWalletBalanceWei, drainWalletBalanceETH });

    const drainWalletNonce = await web3Provider.eth.getTransactionCount(
      drainWallet.address,
    );

    // Drain if enough balance
    if (
      new BN(drainWalletBalanceWei).gt(new BN(calculatedTokenTransferGasFeeWei))
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

    console.log({
      ethToSendToDrainWalletWei,
      ethToSend,
    });

    const encodedTransferData = tokenContract.methods
      .transfer(masterWallet.address, tokenBalanceWei)
      .encodeABI();

    // Here I need to prep with setting the previously fetched gas price, save wallet nonce,
    await sendEth({
      from: masterWallet,
      web3Provider,
      to: drainWallet,
      valueETH: ethToSend,
    });

    // // pass nonce, gasPrice, estimated gas,
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

    await sendEth({
      from: drainWallet,
      web3Provider,
      to: masterWallet,
      valueETH: "MAX",
      fromWalletNonce: drainWalletNonce + BigInt(1),
      gasPriceWei,
    });
  } catch (e) {
    console.log("Error", e);
  }
}
