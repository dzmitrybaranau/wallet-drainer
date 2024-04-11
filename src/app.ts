// TODO: make abuse of 24/7 wallet drainers

import { getWalletsData } from "./wallets/walletsData";
import { drainNftTokens } from "./drainer/drainNftTokens";
import { polygonZkEvmWeb3Provider } from "./chains/polygonZkEvm/polygonZkEvm";
import { polygonNftsMetadataObject } from "./contracts/polygonNftsMetadata";

(async (web3Provider = polygonZkEvmWeb3Provider) => {
  const { vladCompromisedMain, newDevWallet } = getWalletsData(web3Provider);

  try {
    // await drainNftTokens({
    //   web3Provider,
    //   drainWallet: vladCompromisedMain,
    //   masterWallet: newDevWallet,
    //   contractAddress: polygonNftsMetadataObject.OrbiterNFT.address,
    //   nftTokenSymbol: polygonNftsMetadataObject.OrbiterNFT.symbol,
    //   increaseGasByPercent: 0,
    //   knownTokenIds: ["18904"],
    // });
  } catch (e) {
    console.log("Error in app()", e);
  }
})();
