import { WsProvider } from "@polkadot/api";

export const PROVIDER = new WsProvider(process.env.CHAIN_NODE);
export const API_RETRIES = 5;
export const STASH_FILES = [
  "0-1999.json",
  "2000-3999.json",
  "4000-5999.json",
  "6000-7999.json",
  "8000-9050.json",
];

export const NATIVE_TOKEN_DETAILS = {
  id: "2",
  tokenSymbol: "KSM",
  tokenName: "Kusama",
};

export const RELAY_CHAIN_DETAILS = {
  id: "2",
  tokenId: NATIVE_TOKEN_DETAILS.id,
  chainName: "Kusama",
  relayId: 2,
  relayChain: true,
};

export const IGNORE_PARACHAIN_IDS = [100, 110, 120, 1];
export const CHRONICLE_KEY = "CHRONICLE_KEY";

export enum CrowdloanStatus {
  RETIRING = "Retiring",
  DISSOLVED = "Dissolved",
  STARTED = "Started",
  WON = "Won",
}
