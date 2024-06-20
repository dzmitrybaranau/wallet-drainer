import Web3 from "web3";

export const LINEA_CHAIN_RPC =
  "https://linea.drpc.org";
export const LINEA_CHAIN_WSS_RPC =
  "https://wispy-purple-thunder.zksync-mainnet.quiknode.pro/aa0926df13b0e637d2db873e7c5d89a6ef384844/";
export const lineaWeb3Provider = new Web3(LINEA_CHAIN_RPC);
export const lineaWeb3WebSocketProvider = new Web3(LINEA_CHAIN_WSS_RPC);
