import { Web3BaseWalletAccount } from "web3";
import { NFT_ABI } from "../../../types/web3-v1-contracts";

export const getNftTokenIds = async ({
  wallet,
  nftContract,
}: {
  wallet: Web3BaseWalletAccount;
  nftContract: NFT_ABI;
}): Promise<{ tokenIds: string[] }> => {
  try {
    const tokenIds = await nftContract.methods
      .allOwnedIds(wallet.address)
      .call();

    return { tokenIds };
  } catch (e) {
    console.log(`Error in getNftTokenIds`, e);
    throw new Error("getNftTokenIds()");
  }
};
