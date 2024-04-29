import { Web3BaseWalletAccount } from "web3";
import { Web3Provider } from "@type/web3Provider";
import {getTokenBalance, getSmartContract} from "@utils/tokenUtils";

export const checkTokens = async ({
  tokensArray,
  web3Provider,
  wallet,
}: {
  wallet: Web3BaseWalletAccount;
  tokensArray: { address: string; symbol: string }[];
  web3Provider: Web3Provider;
}) => {
  console.log("START");
  for (const zkSyncToken of tokensArray) {
    const tokenContract = getSmartContract({
      contractAddress: zkSyncToken.address,
      web3Provider,
    });
    const { tokenBalanceWei } = await getTokenBalance({
      tokenContract,
      address: wallet.address,
      tokenSymbol: zkSyncToken.symbol,
      web3Provider,
    });
    if (tokenBalanceWei && tokenBalanceWei != "0") {
      console.log(
        `Account[${wallet.address.substring(0, 8)}] ${zkSyncToken.symbol} balance: ${tokenBalanceWei} ${zkSyncToken.address}`,
      );
    }
  }
  console.log("END");
};
