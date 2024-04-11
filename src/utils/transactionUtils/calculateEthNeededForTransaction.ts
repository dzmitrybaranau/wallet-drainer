import { Web3Provider } from "@type/web3Provider";

export const calculateEthNeededForTransaction = ({
  estimatedGasWei,
  gasPriceWei,
  web3Provider,
}: {
  estimatedGasWei: number;
  gasPriceWei: bigint;
  web3Provider: Web3Provider;
}) => {
  try {
    const calculatedGasFeeWei = (
      BigInt(estimatedGasWei) * BigInt(gasPriceWei)
    ).toString();
    const calculatedGasFeeInEth = web3Provider.utils.fromWei(
      calculatedGasFeeWei,
      "ether",
    );

    return {
      calculatedGasFeeWei,
      calculatedGasFeeInEth,
    };
  } catch (e) {
    console.log("Error in calculateEthNeededForTransaction()", e);
    throw new Error("calculateEthNeededForTransaction()");
  }
};
