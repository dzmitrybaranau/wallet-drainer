import TokebAbiJson from "../../contracts/TOKEN_ABI.json";
import { TOKEN_ABI } from "../../../types/web3-v1-contracts";
import { Web3Provider } from "@type/web3Provider";

export const getTokenContract = ({
  contractAddress,
  web3Provider,
}: {
  contractAddress: string;
  web3Provider: Web3Provider;
}) => {
  return new web3Provider.eth.Contract(
    TokebAbiJson,
    contractAddress,
  ) as unknown as TOKEN_ABI;
};
