import { NFT_ABI } from "@type/web3-v1-contracts";
import { Transaction, Web3BaseWalletAccount } from "web3";
import { Web3Provider } from "@type/web3Provider";

export const transferNftToken = async ({
  nftContract,
  to,
  from,
  web3Provider,
  gasPriceWei,
  estimatedGasWei,
  nftTokenSymbol,
  fromWalletNonce,
  encodedTransferData,
}: {
  nftContract: NFT_ABI;
  from: Web3BaseWalletAccount;
  to: Web3BaseWalletAccount;
  web3Provider: Web3Provider;
  gasPriceWei: bigint;
  estimatedGasWei: number;
  fromWalletNonce: bigint;
  encodedTransferData: string;
  nftTokenSymbol: string;
}) => {
  try {
    // Create transaction object
    const tx: Transaction = {
      from: from.address,
      to: nftContract.options.address,
      data: encodedTransferData,
      gas: estimatedGasWei,
      gasPrice: gasPriceWei,
      nonce: fromWalletNonce,
    };

    // TODO: Check if I can sign transcation before sending ETH to Drain Wallet
    const signedTx = await from.signTransaction(tx);

    // Send transaction
    const receipt = await web3Provider.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    );

    console.log(
      `Transferred ${nftTokenSymbol} from ${from.address} to ${to.address}`,
    );
  } catch (e) {
    console.log(`Error in transferNftToken: [${nftTokenSymbol}]`, e);
    throw new Error("transferNftToken()");
  }
};
