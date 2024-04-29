import TokenAbiJson from "../../contracts/TOKEN_ABI.json";
import { TOKEN_ABI } from "@type/web3-v1-contracts";
import { Web3Provider } from "@type/web3Provider";
import { ContractAbi } from "web3";

export const getSmartContract = <T = TOKEN_ABI>({
  contractAddress,
  web3Provider,
  abiJSON = TokenAbiJson,
}: {
  contractAddress: string;
  web3Provider: Web3Provider;
  abiJSON?: ContractAbi;
}) => {
  return new web3Provider.eth.Contract(
    abiJSON,
    contractAddress,
  ) as unknown as T;
};
