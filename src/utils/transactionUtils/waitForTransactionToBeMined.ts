import { Web3Provider } from "@type/web3Provider";

export const waitForTransactionToBeMined = async ({
  transactionHash,
  web3Provider,
}: {
  transactionHash: string;
  web3Provider: Web3Provider;
}) => {
  let transaction = null;
  while (transaction == null || transaction.blockNumber === null) {
    transaction = await web3Provider.eth.getTransaction(transactionHash);
    if (transaction !== null && transaction.blockNumber !== null) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds before checking again
  }
  return transaction;
};
