import { Web3Provider } from "@type/web3Provider";
import { NFT_ABI } from "@type/web3Provider";
import { Web3BaseWalletAccount } from "web3";
import BN from "bn.js";

export const estimateNftTokenTransfer = async ({
  nftContract,
  tokenId,
  web3Provider,
  to,
  from,
  increaseGasByPercent,
}: {
  web3Provider: Web3Provider;
  nftContract: NFT_ABI;
  from: Web3BaseWalletAccount;
  to: Web3BaseWalletAccount;
  tokenId: number | string | BN;
  increaseGasByPercent?: number;
}) => {
  try {
    let gasPriceWei: bigint;
    gasPriceWei = await web3Provider.eth.getGasPrice();
    if (increaseGasByPercent) {
      gasPriceWei =
        (gasPriceWei * BigInt(100 + increaseGasByPercent)) / BigInt(100);
    }
    const estimatedGasWei = await nftContract.methods
      .transferFrom(from.address, to.address, tokenId?.toString())
      .estimateGas({ from: from.address });

    return { gasPriceWei, estimatedGasWei };
  } catch (e) {
    console.log(`Error in estimateNftTokenTransfer: ${tokenId}`, e);
    throw new Error("estimateNftTokenTransfer()");
  }
};
