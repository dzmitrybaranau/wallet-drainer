import { Web3Provider } from "@type/web3Provider";
import { Web3BaseWalletAccount } from "web3";
import BN from "bn.js";
import { estimateEthTransferFee, getEthBalance } from "./index";

export const estimateMaxEthPossibleToSend = async ({
  from,
  web3Provider,
  to,
  gasPriceWei,
}: {
  web3Provider: Web3Provider;
  from: Web3BaseWalletAccount;
  to: Web3BaseWalletAccount;
  gasPriceWei?: bigint;
}): Promise<{ maxTransferableEth: string; maxTransferableWei: BN }> => {
  try {
    // Step 1: Fetch the account balance
    const { ethBalanceWei: fromWalletBalanceWei } = await getEthBalance({
      web3Provider,
      address: from.address,
    });

    const { transactionFeeBN } = await estimateEthTransferFee({
      from,
      walletBalanceWei: fromWalletBalanceWei,
      web3Provider,
      to,
      gasPriceWei,
    });

    let maxTransferableWei = new BN(fromWalletBalanceWei?.toString()).sub(
      transactionFeeBN,
    );

    maxTransferableWei = maxTransferableWei.isNeg()
      ? new BN(0)
      : maxTransferableWei;

    const maxTransferableEth = web3Provider.utils.fromWei(
      maxTransferableWei.toString(),
      "ether",
    );
    return { maxTransferableEth, maxTransferableWei };
  } catch (e) {
    console.log("estimateMaxEthPossibleToSend() ", e);
    throw new Error("estimateMaxEthPossibleToSend() " + e);
  }
};
