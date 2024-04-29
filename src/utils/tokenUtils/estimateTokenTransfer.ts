import { Web3BaseWalletAccount } from "web3";
import { TOKEN_ABI } from "@type/web3-v1-contracts";
import { Web3Provider } from "@type/web3Provider";

export const estimateTokenTransfer = async ({
  from,
  to,
  tokenAmountWei,
  tokenContract,
  web3Provider,
  increaseGasByPercent,
}: {
  from: Web3BaseWalletAccount;
  to: Web3BaseWalletAccount;
  tokenAmountWei: string;
  tokenContract: TOKEN_ABI;
  web3Provider: Web3Provider;
  increaseGasByPercent?: number;
}): Promise<{
  calculatedTokenTransferGasFeeInEth: string;
  calculatedTokenTransferGasFeeWei: string;
  gasPriceWei: bigint;
  estimatedGasWei: number;
}> => {
  try {
    let gasPriceWei: bigint;
    gasPriceWei = await web3Provider.eth.getGasPrice();
    if (increaseGasByPercent) {
      gasPriceWei =
        (gasPriceWei * BigInt(100 + increaseGasByPercent)) / BigInt(100);
    }

    const estimatedGasWei = await tokenContract.methods
      .transfer(to.address, tokenAmountWei)
      .estimateGas({ from: from.address });

    const calculatedGasFeeWei = (
      BigInt(estimatedGasWei) * BigInt(gasPriceWei)
    ).toString();
    const calculatedGasFeeInEth = web3Provider.utils.fromWei(
      calculatedGasFeeWei,
      "ether",
    );

    return {
      calculatedTokenTransferGasFeeInEth: calculatedGasFeeInEth,
      calculatedTokenTransferGasFeeWei: calculatedGasFeeWei,
      gasPriceWei,
      estimatedGasWei,
    };
  } catch (e) {
    console.log("ERROR: estimateTokenTransfer", e);
    throw new Error("estimateTokenTransfer()");
  }
};
