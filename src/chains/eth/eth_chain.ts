import Web3 from "web3";
import { Web3Provider } from "@type/web3Provider";

export const ETH_CHAIN_RPC = "https://rpc.mevblocker.io";
export const ethWeb3Provider = new Web3(ETH_CHAIN_RPC);

export async function getEthBalance({
  web3Provider,
  address,
}: {
  address: string;
  web3Provider: Web3Provider;
}): Promise<{ ethBalanceEth: string; ethBalanceWei: string }> {
  try {
    const ethBalanceWei = await web3Provider.eth.getBalance(address);
    const ethBalanceEth = web3Provider.utils.fromWei(ethBalanceWei, "ether");
    return { ethBalanceEth, ethBalanceWei: ethBalanceWei?.toString() };
  } catch (e) {
    console.log(`Error in getEthBalance: [${address}]`, e);
    throw new Error("getEthBalance()");
  }
}
