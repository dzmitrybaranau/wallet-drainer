import * as bip39 from "bip39";
import { hdkey } from "ethereumjs-wallet";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { Web3Provider } from "@type/web3Provider";

export const getWalletPrivateKeysFromSeedPhrase = ({
  seedPhrase,
  web3Provider,
}: {
  seedPhrase: string;
  web3Provider: Web3Provider;
}) => {
  const provider = new HDWalletProvider({
    mnemonic: {
      phrase: seedPhrase,
    },
    providerOrUrl: web3Provider.provider,
  });
  const addresses = provider.getAddresses();

  const seed = bip39.mnemonicToSeedSync(seedPhrase);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";

  const privateKeys: string[] = [];
  for (let i = 0; i < addresses.length; i++) {
    const wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
    const privateKey = wallet.getPrivateKeyString();
    privateKeys.push(privateKey);
  }

  return { privateKeys };
};
