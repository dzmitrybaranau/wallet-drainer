import { Web3 } from "web3";
import Web3V1 from "web3v1";

const web3Provider = new Web3("https://mainnet.infura.io/v3/your_infura_key");
const web3V1Provider = new Web3V1(
  "https://mainnet.infura.io/v3/your_infura_key",
);
export type Web3Provider = typeof web3Provider;
export type Web3V1ProviderType = typeof web3V1Provider;
