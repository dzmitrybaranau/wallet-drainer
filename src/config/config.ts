import { config } from "dotenv";
config();
const initConfig = (): {
  COMPROMISED_MAIN_WALLET: string;
  NEW_DEV_WALLET: string;
  NEW_DEV_2_WALLET: string;
  COMPROMISED_DEV: string;
  COMPROMISED_VLAD: string;
} => {
  if (!process.env.COMPROMISED_MAIN_WALLET) {
    throw new Error("COMPROMISED_MAIN_WALLET is required");
  }
  if (!process.env.NEW_DEV_WALLET) {
    throw new Error("NEW_DEV_WALLET is required");
  }
  if (!process.env.NEW_DEV_2_WALLET) {
    throw new Error("NEW_DEV_2_WALLET is required");
  }
  if (!process.env.COMPROMISED_DEV) {
    throw new Error("COMPROMISED_DEV is required");
  }
  if (!process.env.COMPROMISED_VLAD) {
    throw new Error("VLAD_COMPROMISED_MAIN is required");
  }

  return {
    COMPROMISED_MAIN_WALLET: process.env.COMPROMISED_MAIN_WALLET,
    NEW_DEV_WALLET: process.env.NEW_DEV_WALLET,
    NEW_DEV_2_WALLET: process.env.NEW_DEV_2_WALLET,
    COMPROMISED_DEV: process.env.COMPROMISED_DEV,
    COMPROMISED_VLAD: process.env.COMPROMISED_VLAD,
  };
};

const configuration = initConfig();

export default configuration;
