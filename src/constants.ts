import { WsProvider } from "@polkadot/api";

export const CHAIN_NODE = "wss://kusama-rpc.polkadot.io";
export const INDEXER_ENDPOINT_URL =
  "https://kusama.indexer.gc.subsquid.io/v4/graphql";

export const PROVIDER = new WsProvider(CHAIN_NODE);
export const API_RETRIES = 5;
export const STASH_FILES = [
  "0-1999.json",
  "2000-3999.json",
  "4000-5999.json",
  "6000-7999.json",
  "8000-9050.json",
];

export const KUSAMA_TOKEN_DETAILS = {
  id: "2",
  // tokenSymbol: "KSM",
  tokenName: "Kusama",
};

export const KUSAMA_CHAIN_DETAILS = {
  id: "2",
  tokenId: KUSAMA_TOKEN_DETAILS.id,
  chainName: "Kusama",
  relayId: "2",
  relayChain: true,
  registeredAt: new Date("2019-11-28Z17:27:54"), // remake it to rpc call
};

export enum CrowdloanStatus {
  RETIRING = "Retiring",
  DISSOLVED = "Dissolved",
  STARTED = "Started",
  WON = "Won",
}

export enum LockId {
  democrac = "democrac",
  staking = "staking",
  phrelect = "phrelect",
  vesting = "vesting",
}

export const BALANCES_RPC_CALL_BLOCK_HEIGHT_OFFSET = 100;
export const BALANCES_RPC_CALL_BLOCK_TIMESTAMP_OFFSET = 24 * 60 * 60 * 1000; // 1 day in ms

export enum RpcFunctionPaths {
  systemAccountInfo = "query.system.account",
  crowdloanInfo = "query.crowdloan.funds",
  lastProcessedBlockNumber = "query.system.number",
  lockedBalances = "query.balances.locks",
  parachainInfo = "query.registrar.paras",
}
export type RpcFunctionType = {
  path: RpcFunctionPaths;
  availableAtBlockNumber: number;
};
export class RpcFunction {
  static get systemAccountInfo(): RpcFunctionType {
    return {
      path: RpcFunctionPaths.systemAccountInfo,
      availableAtBlockNumber: 1375087,
    };
  }

  static get crowdloanInfo(): RpcFunctionType {
    return {
      path: RpcFunctionPaths.crowdloanInfo,
      availableAtBlockNumber: 7468104,
    };
  }

  static get lastProcessedBlockNumber(): RpcFunctionType {
    return {
      path: RpcFunctionPaths.lastProcessedBlockNumber,
      availableAtBlockNumber: 1,
    };
  }

  static get lockedBalances(): RpcFunctionType {
    return {
      path: RpcFunctionPaths.lockedBalances,
      availableAtBlockNumber: 1,
    };
  }

  static get parachainInfo(): RpcFunctionType {
    return {
      path: RpcFunctionPaths.parachainInfo,
      availableAtBlockNumber: 7468793,
    };
  }
}
