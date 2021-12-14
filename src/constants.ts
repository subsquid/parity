const { WsProvider } = require('@polkadot/api')
export const PROVIDER = new WsProvider('wss://kusama-rpc.polkadot.io/')
export const INDEXER = 'https://kusama.indexer.gc.subsquid.io/v4/graphql'
export const API_RETRIES = 5;
export const QUERY_CACHE_SIZE = 100
export const ADDRESS_PREFIX  = 2

export const NATIVE_TOKEN_DETAILS = {
  id: "1",
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




// export const IGNORE_PARACHAIN_IDS = [100, 110, 120, 1];
// export const CHRONICLE_KEY = 'CHRONICLE_KEY';

// export enum CROWDLOAN_STATUS {
//   RETIRING = "Retiring",
//   DISSOLVED = "Dissolved",
//   STARTED = "Started",
//   WON = "Won",
// }
