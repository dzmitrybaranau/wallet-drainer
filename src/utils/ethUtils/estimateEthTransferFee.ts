import { Web3Provider } from "@type/web3Provider";
import { Web3BaseWalletAccount } from "web3";
import BN from "bn.js";

export const estimateEthTransferFee = async ({
  walletBalanceWei,
  from,
  to,
  web3Provider,
  gasPriceWei,
}: {
  web3Provider: Web3Provider;
  from: Web3BaseWalletAccount;
  to: Web3BaseWalletAccount;
  walletBalanceWei: string;
  gasPriceWei?: bigint;
}) => {
  // Step 2: Get the current gas price
  let gasPrice;
  if (gasPriceWei) {
    gasPrice = gasPriceWei;
  } else {
    gasPrice = await web3Provider.eth.getGasPrice();
  }

  // Step 3: Dynamically estimate the gas limit for a simple transfer
  const estimatedGasWei = await web3Provider.eth.estimateGas({
    from: from.address,
    to: to.address,
    value: walletBalanceWei,
  });

  // Step 4: Calculate the transaction fee
  const transactionFeeBN = new BN(gasPrice.toString()).mul(
    new BN(estimatedGasWei?.toString()),
  );

  return { transactionFeeBN };
};
