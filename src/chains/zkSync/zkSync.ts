import Web3 from "web3";

export const ZK_SYNC_CHAIN_RPC =
  "https://blue-intensive-model.zksync-mainnet.quiknode.pro/a8e08495605b4144b56333b39fc5006f23f9015c/";
export const ZK_SYNC_CHAIN_WSS_RPC =
  "wss://blue-intensive-model.zksync-mainnet.quiknode.pro/a8e08495605b4144b56333b39fc5006f23f9015c/";
export const zkSyncWeb3Provider = new Web3(ZK_SYNC_CHAIN_RPC);
export const zkSyncWeb3WebSocketProvider = new Web3(ZK_SYNC_CHAIN_WSS_RPC);
