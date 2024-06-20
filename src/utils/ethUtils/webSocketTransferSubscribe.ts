import { Web3Provider } from "@type/web3Provider";
import { TOKEN_ABI } from "@type/web3-v1-contracts";

export const webSocketTransferSubscribe = async ({
  tokenContract,
  walletAddress,
}: {
  walletAddress: string;
  tokenContract: TOKEN_ABI;
  web3WebSocketProvider: Web3Provider;
}) => {
  tokenContract.events.Transfer(
    {
      filter: {
        to: walletAddress,
      },
      fromBlock: "latest",
    },
    (error, result) => {
      if (error) {
        console.error("Error in Transfer event", error);
      } else {
        console.log("Transfer event", result);
      }
    },
  );
};
