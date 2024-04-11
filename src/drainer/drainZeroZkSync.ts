import { drainNftTokens } from "./drainNftTokens";
import { getWalletsData } from "../wallets/walletsData";
import { zkSyncWeb3Provider } from "../chains/zkSync/zkSync";
import { drainToken } from "./drainToken";

const drainZeroZkSync = async () => {
  const web3Provider = zkSyncWeb3Provider;

  // map through all the wallets to collect $ZERO token
  drainToken({
    drainWallet: getWalletsData(web3Provider).vladCompromisedMain,
    web3Provider,
    tokenSymbol: "$ZERO",
    tokenAddress: "",
    masterWallet: getWalletsData(web3Provider).newDevWallet,
  });
};
