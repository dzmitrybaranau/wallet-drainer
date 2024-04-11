import { Web3Provider } from "@type/web3Provider";
import NftTokenAbiJson from "../../contracts/NFT_ABI.json";
import { NFT_ABI } from "../../../types/web3-v1-contracts";

export const getNftContract = ({
  contractAddress,
  web3Provider,
}: {
  web3Provider: Web3Provider;
  contractAddress: string;
}) => {
  try {
    return new web3Provider.eth.Contract(
      NftTokenAbiJson,
      contractAddress,
    ) as unknown as NFT_ABI;
  } catch (e) {
    console.log(`Error in getNftContract: [${contractAddress}]`, e);
    throw new Error("getNftContract()");
  }
};
