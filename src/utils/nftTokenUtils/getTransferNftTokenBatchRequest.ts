import {NFT_ABI} from "../../../types/web3-v1-contracts";
import {JsonRpcRequest, Transaction, Web3BaseWalletAccount} from "web3";
import {Web3Provider} from "@type/web3Provider";

export const getTransferNftTokenBatchRequest = async ({
                                                          nftContract,
                                                          from,
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

        const signedNftTransferTransactionBatchRequest =
            await from.signTransaction(tx);

        const transferNftTokenJsonRpcBatchRequest: JsonRpcRequest = {
            jsonrpc: "2.0",
            id: fromWalletNonce.toString(),
            method: "eth_sendRawTransaction",
            params: [signedNftTransferTransactionBatchRequest.rawTransaction],
        };

        return { transferNftTokenJsonRpcBatchRequest };
    } catch (e) {
        console.log(`Error in transferNftToken: [${nftTokenSymbol}]`, e);
        throw new Error("transferNftToken()");
    }
};
