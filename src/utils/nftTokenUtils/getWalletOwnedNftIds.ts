import { NFT_ABI } from "@type/web3-v1-contracts";
import { Web3BaseWalletAccount } from "web3";
import { Web3Provider } from "@type/web3Provider";

export const getWalletOwnedNftIds = async ({
  nftContract,
  wallet,
  web3Provider,
}: {
  nftContract: NFT_ABI;
  wallet: Web3BaseWalletAccount;
  web3Provider: Web3Provider;
}) => {
  try {
    const maxBlockRange = BigInt(100000);
    const latestBlock = await web3Provider.eth.getBlockNumber();
    let fromBlock = BigInt(0);
    let toBlock = fromBlock + maxBlockRange;
    let toEvents: any[] = [];
    let fromEvents: any[] = [];

    try {
      const eventsTo = await nftContract.getPastEvents("Transfer", {
        filter: { to: wallet.address }, // use 'from' if you want to get NFTs transferred from the wallet
        fromBlock: "earliest",
        toBlock: "latest",
      });
      toEvents.push(...eventsTo);
    } catch (e) {
      console.log(
        `Error in getWalletOwnedNftIds() eventsTo, trying to go through max block amounts`,
        e,
      );
      while (fromBlock < latestBlock) {
        if (toBlock > latestBlock) {
          toBlock = latestBlock;
        }

        const eventsTo = await nftContract.getPastEvents("Transfer", {
          filter: { to: wallet.address }, // use 'from' if you want to get NFTs transferred from the wallet
          fromBlock: fromBlock?.toString(),
          toBlock: toBlock?.toString(),
        });
        toEvents.push(...eventsTo);

        if (eventsTo?.length > 0) {
          console.log(eventsTo?.[0]?.returnValues);
        }

        const eventsFrom = await nftContract.getPastEvents("Transfer", {
          filter: { to: wallet.address }, // use 'from' if you want to get NFTs transferred from the wallet
          fromBlock: fromBlock?.toString(),
          toBlock: toBlock?.toString(),
        });
        toEvents.push(...eventsFrom);

        fromBlock = toBlock + BigInt(1);
        toBlock = fromBlock + maxBlockRange;

        const blocksExplored =
          fromBlock > latestBlock ? latestBlock : BigInt(fromBlock);
        const totalBlocks = BigInt(latestBlock);
        const percentageExplored = (blocksExplored / totalBlocks) * BigInt(100);
        console.log(`Explored ${Number(percentageExplored).toFixed(2)}% of blocks.`);
        process.stdout.write(`Explored ${Number(percentageExplored).toFixed(2)}% of blocks...\r`);
      }
    }

    const nftTokenIds: string[] = toEvents.map((event) => {
      return event.returnValues.tokenId;
    });

    // TODO: Substract NFT token ids that were sent from the wallet
    const sentNftTokenIds = fromEvents.map((event) => {
      return event.returnValues.tokenId;
    });

    return { nftTokenIds };
  } catch (e) {
    console.log(`Error in getWalletOwnedNftIds`, e);
    throw new Error("getWalletOwnedNftIds()");
  }
};
