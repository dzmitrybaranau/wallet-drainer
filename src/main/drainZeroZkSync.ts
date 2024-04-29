import { zkSyncWeb3Provider } from "../chains/zkSync/zkSync";
import { Web3BaseWalletAccount } from "web3";
import { Web3Provider } from "@type/web3Provider";
import { estimateTokenTransfer, getSmartContract } from "@utils/tokenUtils";
import { getTransferTokenBatchRequest } from "@utils/tokenUtils/getTransferTokenBatchRequest";

const claimZkSync = async ({
  wallet,
  web3Provider,
}: {
  wallet: Web3BaseWalletAccount;
  web3Provider: Web3Provider;
}) => {
  // claim token
  // return amount if token claimed
};
const drainZeroZkSync = async ({
  walletToDrain,
  masterWallet,
}: {
  walletToDrain: Web3BaseWalletAccount;
  masterWallet: Web3BaseWalletAccount;
}) => {
  const web3Provider = zkSyncWeb3Provider;
  const batch = new web3Provider.BatchRequest();

  const gasPrice = await web3Provider.eth.getGasPrice();

  const zkSyncTokenContract = getSmartContract({
    web3Provider,
    contractAddress: "",
  });

  // Check how much token will be claimed
  const tokenAmountWei = "0";

  // estimate claim function
  // estimate transfer function
  const estimatedGasWei = estimateTokenTransfer({
    from: walletToDrain,
    to: masterWallet,
    web3Provider,
    tokenContract: zkSyncTokenContract,
    tokenAmountWei,
  });

  // encode transfer data
  const encodedTransferData = zkSyncTokenContract.methods
    .transfer(masterWallet.address, tokenAmountWei)
    .encodeABI();

  const drainNonce = await web3Provider.eth.getTransactionCount(
    walletToDrain.address,
  );

  // Get batch transaction for claim
  await claimZkSync({ wallet: walletToDrain, web3Provider });

  // get batch transaction for tokenTransfer
  const { transferTokenJsonRpcBatchRequest } =
    await getTransferTokenBatchRequest({
      from: walletToDrain,
      fromWalletNonce: drainNonce,
      tokenContract: zkSyncTokenContract,
      gasPriceWei: gasPrice,
      estimatedGasWei: 0,
      encodedTransferData: encodedTransferData,
    });
  batch.add(transferTokenJsonRpcBatchRequest);

  // send estimated ETH for 2 transactions *maybe without even estimation, just N amount of ETH and N amount of gas

  // run batch transaction for claim and for token transfer
};
