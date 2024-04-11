import Web3, { Web3BaseWalletAccount } from "web3";

export const GOERLI_CHAIN_RPC = "https://goerli.blockpi.network/v1/rpc/public";

export const goerliWeb3Provider = new Web3(GOERLI_CHAIN_RPC);

export const goerliChain = {
  getGoerliBalance,
  sendGoerli,
};

export async function getGoerliBalance(address: string) {
  const balanceWei = await goerliWeb3Provider.eth.getBalance(address);
  const balanceEth = goerliWeb3Provider.utils.fromWei(balanceWei, "ether");
  console.log(`${address} Balance: ${balanceEth} GOERLI`);
  return;
}

async function sendGoerli({
  fromWallet,
  toAddress,
  amount,
}: {
  fromWallet: Web3BaseWalletAccount;
  toAddress: string;
  amount: string;
}) {
  const gasPrice = await goerliWeb3Provider.eth.getGasPrice();
  const value = goerliWeb3Provider.utils.toWei(amount, "ether");
  const estimateGas = await goerliWeb3Provider.eth.estimateGas({
    from: fromWallet.address,
    to: toAddress,
    value,
  });

  const nonce = await goerliWeb3Provider.eth.getTransactionCount(
    fromWallet.address,
    "pending",
  );

  console.log({ nonce, value, estimateGas });
  const tx = {
    from: fromWallet.address,
    to: toAddress,
    value,
    gas: estimateGas,
    gasPrice,
    nonce,
    chainId: 5,
  };

  try {
    const signedTx = await goerliWeb3Provider.eth.accounts.signTransaction(
      tx,
      fromWallet.privateKey,
    );
    console.log({ signedTx });

    const receipt = await goerliWeb3Provider.eth.sendSignedTransaction(
      signedTx.rawTransaction as string,
    );
    console.log(`Transaction hash: ${receipt}`);
  } catch (e) {
    console.error("Failed to send Goerli", e);
  }
}
