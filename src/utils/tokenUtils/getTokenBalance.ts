import { TOKEN_ABI } from "../../../types/web3-v1-contracts";
import BN from "bn.js";
import { Web3Provider } from "@type/web3Provider";

export const getTokenBalance = async ({
  tokenContract,
  address,
  tokenSymbol,
  web3Provider,
}: {
  tokenContract: TOKEN_ABI;
  address: string;
  tokenSymbol: string;
  web3Provider: Web3Provider;
}): Promise<{ tokenBalanceWei: string; tokenBalanceEth: string }> => {
  try {
    const balance = (
      await tokenContract.methods.balanceOf(address).call()
    )?.toString();
    const balanceBigNumber = new BN(balance);
    if (balanceBigNumber.isZero()) {
      return { tokenBalanceWei: "0", tokenBalanceEth: "0" };
    }

    return {
      tokenBalanceWei: balance.toString(),
      tokenBalanceEth: web3Provider.utils.fromWei(balance, "ether"),
    };
  } catch (e) {
    console.log(`Error in getTokenBalance: [${tokenSymbol}]`, e);
    throw new Error("getTokenBalance()");
  }
};
