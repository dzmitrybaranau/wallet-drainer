import { Web3Provider } from "@type/web3Provider";
import { Web3BaseWalletAccount } from "web3";
import config from "../config";

export const getWalletsData = (web3Provider: Web3Provider) => ({
  // 0xB3F72a0aE5fB0Fc57103cE390281F190A7182c90
  compromisedMainWallet: getWalletFromPrivateKey({
    privateKey: config.COMPROMISED_MAIN_WALLET,
    web3Provider,
  }),

  // 0x5608C76d755B677E00a6D1Ca9532f1D8Fc768A0a
  newDevWallet: getWalletFromPrivateKey({
    privateKey: config.NEW_DEV_WALLET,
    web3Provider,
  }),
  // 0x172AABf09A804DcddB6fB13c1631f973471a2847
  newDev2Wallet: getWalletFromPrivateKey({
    privateKey: config.NEW_DEV_2_WALLET,
    web3Provider,
  }),
  // 0x4CC52AB726131A5191e79580D032848ca6d4d226
  compromisedDev: getWalletFromPrivateKey({
    privateKey: config.COMPROMISED_DEV,
    web3Provider,
  }),
  // 0x0C35aBa28D30cEeDf2276Ea1629b1D6aC7D76d4e
  vladCompromisedMain: getWalletFromPrivateKey({
    privateKey: config.COMPROMISED_VLAD,
    web3Provider,
  }),
});

export const getWalletFromPrivateKey = ({
  privateKey,
  web3Provider,
}: {
  privateKey: string;
  web3Provider: Web3Provider;
}): Web3BaseWalletAccount => {
  return web3Provider.eth.accounts.privateKeyToAccount(privateKey);
};
