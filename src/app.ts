// TODO: make abuse of 24/7 wallet drainers

import { zkSyncWeb3Provider } from "./chains/zkSync/zkSync";
import { getWalletFromPrivateKey, getWalletsData } from "@config/walletsData";
import privateKeys from "../privateKeys.json";
import { sendEth } from "@utils/ethUtils";
import { wait } from "@utils/utils";
import { checkWalletEligibilityAvail } from "./main/checkEligibilityAvail/checkWalletEligibilityAvail";

(async (web3Provider = zkSyncWeb3Provider) => {
  const { vladCompromisedMain, newDevWallet, newDev2Wallet } =
    getWalletsData(web3Provider);

  for (const privateKey of privateKeys) {
    const walletToDrain = getWalletFromPrivateKey({
      web3Provider,
      privateKey: privateKey,
    });
    await checkWalletEligibilityAvail({ wallet: walletToDrain });
    await wait(1000);
  }
  try {
  } catch (e) {
    console.log("Error in app()", e);
  }
})();
