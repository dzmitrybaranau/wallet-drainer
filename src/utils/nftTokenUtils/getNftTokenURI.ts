import { NFT_ABI } from "../../../types/web3-v1-contracts";
import BN from "bn.js";

export const getNftTokenURI = async ({
  tokenId,
  nftContract,
}: {
  nftContract: NFT_ABI;
  tokenId: number | string | BN;
}) => {
  try {
    const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
    console.log({ tokenURI });
  } catch (e) {
    console.log(`Error in getNFTTokenURI: [${tokenId}]`, e);
    throw new Error("getNFTTokenURI()");
  }
};
