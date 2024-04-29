import {
  estimateNftTokenTransfer,
  getNftContract,
  getTransferNftTokenBatchRequest,
  getWalletOwnedNftIds,
} from "@utils/nftTokenUtils";
import { Web3Provider } from "@type/web3Provider";
import { Web3BaseWalletAccount } from "web3";
import BN from "bn.js";
import {
  estimateMaxEthPossibleToSend,
  getEthBalance,
  getSendEthBatch,
  sendEth,
} from "@utils/ethUtils";
import { calculateEthNeededForTransaction } from "@utils/transactionUtils";

export const drainNftTokens = async ({
  contractAddress,
  web3Provider,
  drainWallet,
  masterWallet,
  nftTokenSymbol,
  knownTokenIds,
  increaseGasByPercent,
  fixedGasPriceWei,
}: {
  contractAddress: string;
  web3Provider: Web3Provider;
  drainWallet: Web3BaseWalletAccount;
  masterWallet: Web3BaseWalletAccount;
  nftTokenSymbol: string;
  knownTokenIds?: string[];
  increaseGasByPercent: number;
  fixedGasPriceWei?: bigint;
}) => {
  // TODO: Make sure that batch transactions are done in the correct order
  try {
    // Get NFT contract
    const nftContract = getNftContract({ contractAddress, web3Provider });

    console.log("Start retrieving NFT tokens data from blockchain...");
    let tokenIds;
    if (!knownTokenIds) {
      // Get drain wallet NFT token ids
      const { nftTokenIds } = await getWalletOwnedNftIds({
        wallet: drainWallet,
        nftContract,
        web3Provider,
      });
      tokenIds = nftTokenIds;
    } else {
      tokenIds = knownTokenIds;
    }
    console.log(`${drainWallet.address}: ${nftTokenSymbol}`, { tokenIds });

    // TODO: Check if I can estimate all NFT tokens at once and send enough ETH to cover all transfers
    // Transfer all NFT tokens
    for (const nftTokenId of tokenIds) {
      // Get drain wallet balance
      let { ethBalanceWei: drainWalletBalanceWei } = await getEthBalance({
        address: drainWallet.address,
        web3Provider,
      });
      console.log({
        drainWalletBalanceWei,
        drainWalletBalanceETH: web3Provider.utils.fromWei(
          drainWalletBalanceWei,
          "ether",
        ),
      });

      let gasPriceWei;
      // Estimate gas for NFT transfer
      const { estimatedGasWei, gasPriceWei: gasPriceWeiIncreased } =
        await estimateNftTokenTransfer({
          nftContract,
          tokenId: nftTokenId,
          to: masterWallet,
          web3Provider,
          from: drainWallet,
          increaseGasByPercent,
        });
      if (fixedGasPriceWei) {
        gasPriceWei = fixedGasPriceWei;
      } else {
        gasPriceWei = gasPriceWeiIncreased;
      }
      console.log({ gasPriceWei, gasPriceWeiIncreased, estimatedGasWei });

      let drainWalletNonce = await web3Provider.eth.getTransactionCount(
        drainWallet.address,
      );
      let masterWalletNonce = await web3Provider.eth.getTransactionCount(
        masterWallet.address,
      );

      // TODO: Calculate the ETH needed for the transaction NOTE: for ETH chains need to send slightly more, because of the gasPrice fluctuation
      // Need to research if setting fixed gas price will solve the issue
      const { calculatedGasFeeWei: nftTokenTransferCalculatedGasFeeWei } =
        calculateEthNeededForTransaction({
          estimatedGasWei,
          web3Provider,
          gasPriceWei,
        });
      console.log({
        nftTokenTransferCalculatedGasFeeEth: web3Provider.utils.fromWei(
          nftTokenTransferCalculatedGasFeeWei,
          "ether",
        ),
      });

      const batch = new web3Provider.eth.BatchRequest();
      if (
        !new BN(drainWalletBalanceWei).gt(
          new BN(nftTokenTransferCalculatedGasFeeWei),
        )
      ) {
        // TODO: Need to send a bit more ETH to the drain wallet because of the gas price fluctuation, but if I will set the gasPrice to a fixed amount then it seems irrelevant, since I will not go beyond the gas limit anyway and send correct amount of ETH
        const ethToSendToDrainWalletWei = new BN(
          nftTokenTransferCalculatedGasFeeWei,
        )
          .sub(new BN(drainWalletBalanceWei))
          .toString();

        console.log(
          `Drain wallet don't have enough ETH ${web3Provider.utils.fromWei(drainWalletBalanceWei, "ether")} to send NFT token...
           Needs: ${web3Provider.utils.fromWei(
             ethToSendToDrainWalletWei,
             "ether",
           )} more`,
        );

        await sendEth({
          from: masterWallet,
          to: drainWallet,
          valueETH: web3Provider.utils.fromWei(
            ethToSendToDrainWalletWei,
            "ether",
          ),
          web3Provider,
          fromWalletNonce: masterWalletNonce,
        });
        masterWalletNonce += BigInt(1);
        console.log(
          `Sent ${web3Provider.utils.fromWei(ethToSendToDrainWalletWei, "ether")} ETH to Drain`,
        );
      }
      console.log(
        `Drain wallet has enough eth to make the transfer... ${web3Provider.utils.fromWei(drainWalletBalanceWei, "ether")} `,
      );

      const encodedTransferData = nftContract.methods
        .transferFrom(drainWallet.address, masterWallet.address, nftTokenId)
        .encodeABI();

      const { transferNftTokenJsonRpcBatchRequest } =
        await getTransferNftTokenBatchRequest({
          nftContract,
          from: drainWallet,
          to: masterWallet,
          web3Provider,
          fromWalletNonce: drainWalletNonce,
          nftTokenSymbol,
          estimatedGasWei,
          gasPriceWei,
          encodedTransferData,
        });
      drainWalletNonce += BigInt(1);
      drainWalletBalanceWei = (
        BigInt(drainWalletBalanceWei) -
        BigInt(nftTokenTransferCalculatedGasFeeWei)
      ).toString();
      const transferNftBatchRequestPromise = batch.add(
        transferNftTokenJsonRpcBatchRequest,
      );
      transferNftBatchRequestPromise
        .then(() => {
          console.log(`Sent NFT token ${nftTokenId} to Master`);
        })
        .catch((e) => {
          console.log("Error in transferNftBatchRequestPromise", e);
        });
      console.log(`Added NFT transfer request to the batch`);

      // Calculate max transferable ETH but honestly it's not needed because I'm not sending more then needed
      const { maxTransferableEth, maxTransferableWei } =
        await estimateMaxEthPossibleToSend({
          web3Provider,
          from: drainWallet,
          to: masterWallet,
          gasPriceWei,
        });

      const estimatedGasSendFromDrainToMaster =
        await web3Provider.eth.estimateGas({
          from: drainWallet.address,
          to: masterWallet.address,
          value: maxTransferableWei.toNumber(),
        });

      const { sendEthBatchRequestJsonRpc: drainSendEthBatchRequestJsonRpc } =
        await getSendEthBatch({
          from: drainWallet,
          to: masterWallet,
          fromWalletNonce: drainWalletNonce,
          valueWei: web3Provider.utils.toWei(maxTransferableEth, "ether"),
          estimatedGasWei: estimatedGasSendFromDrainToMaster,
          gasPriceWei,
        });

      const drainSendEthBackBatchRequestPromise = batch.add(
        drainSendEthBatchRequestJsonRpc,
      );
      drainSendEthBackBatchRequestPromise
        .then(() => {
          console.log(`Sent ${maxTransferableEth} ETH back to Master`);
        })
        .catch((e) => {
          console.log("Error in drainSendEthBatchRequestPromise", e);
        });

      await batch.execute({ timeout: 10000 }).catch((err) => {
        console.log("Error in batch.execute()", err);
        throw new Error("batch.execute()");
      });
    }
  } catch (e) {
    console.log(`Error in drainNftTokens: NftContract: ${contractAddress}`, e);
    throw new Error("drainNftTokens()");
  }
};
