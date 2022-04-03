import { WsProvider } from "@polkadot/api";

export const CHAIN_NODE = "wss://kusama-rpc.polkadot.io";
// export const CHAIN_NODE = "wss://rpc.pinknode.io/kusama/fde5d335-7fe9-402f-8be0-6b33065999aa";
export const INDEXER_ENDPOINT_URL =
  "https://kusama.indexer.gc.subsquid.io/v4/graphql";

export const PROVIDER = new WsProvider(CHAIN_NODE);
export const STASH_FILES = [
  "0-1999.json",
  "2000-3999.json",
  "4000-5999.json",
  "6000-7999.json",
  "8000-9050.json",
];

// ??
export const IGNORE_PARACHAIN_IDS = [100, 110, 120, 1];

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

export enum AuctionStatus {
  Started = "Started",
  Closed = "Closed",
}

export enum LockId {
  democrac = "democrac",
  staking = "staking",
  phrelect = "phrelect",
  vesting = "vesting",
}

export const START_FROM_BLOCK = 1;
export const PROCESSOR_BATCH_SIZE = 200;

export const BALANCES_RPC_BLOCK_CHUNK_SIZE = 500;
export const BALANCES_RPC_BLOCK_TIMESTAMP_OFFSET = 24 * 60 * 60 * 1000; // each 24 hours

export enum RpcQueriesPath {
  systemAccountInfo = "query.system.account",
  crowdloanInfo = "query.crowdloan.funds",
  lockedBalances = "query.balances.locks",
  parachainInfo = "query.registrar.paras",
  timestamp = "query.timestamp.now",
}

export enum RpcConstantPath {
  auctionEndingPeriod = "consts.auctions.endingPeriod",
  auctionLeasePeriodsPerSlot = "consts.auctions.leasePeriodsPerSlot",
  slotsLeasePeriod = "consts.slots.leasePeriod",
}

export enum RpcChainPath {
  blockHash = "rpc.chain.getBlockHash",
}

export interface IRpcFunctionItem {
  path: RpcQueriesPath | RpcConstantPath | RpcChainPath;
  availableAtBlockNumber: number | string;
  callable?: boolean;
  // Whether function response should be cached or not
  cache?: boolean;
  // Max amount of cache value to be read. Needed sometimes to keep cache up to date.
  cacheLimit?: number;
}

class RpcQuery implements IRpcFunctionItem {
  constructor(
    public path: RpcQueriesPath,
    public availableAtBlockNumber: number,
    public callable: boolean = true,
    public cache: boolean = true,
    public cacheLimit?: number
  ) {}
}

class RpcChain implements IRpcFunctionItem {
  constructor(
    public path: RpcChainPath,
    public availableAtBlockNumber: string = "last",
    public callable: boolean = true,
    public cache: boolean = true,
    public cacheLimit?: number
  ) {}
}

class RpcConstant implements IRpcFunctionItem {
  constructor(
    public path: RpcConstantPath,
    public availableAtBlockNumber: string = "last",
    public callable: boolean = false,
    public cache: boolean = true,
    public cacheLimit?: number
  ) {}
}

export class RpcFunction {
  static get systemAccountInfo(): IRpcFunctionItem {
    return new RpcQuery(RpcQueriesPath.systemAccountInfo, 1375087);
  }

  static get crowdloanInfo(): IRpcFunctionItem {
    return new RpcQuery(RpcQueriesPath.crowdloanInfo, 7468104, true, true, 200);
  }

  static get lockedBalances(): IRpcFunctionItem {
    return new RpcQuery(RpcQueriesPath.lockedBalances, 3000000);
  }

  static get parachainInfo(): IRpcFunctionItem {
    return new RpcQuery(RpcQueriesPath.parachainInfo, 7468793, true, true, 200);
  }

  static get timestamp(): IRpcFunctionItem {
    return new RpcQuery(RpcQueriesPath.timestamp, 1);
  }

  static get auctionEndingPeriod(): IRpcFunctionItem {
    return new RpcConstant(RpcConstantPath.auctionEndingPeriod);
  }

  static get auctionLeasePeriodsPerSlot(): IRpcFunctionItem {
    return new RpcConstant(RpcConstantPath.auctionLeasePeriodsPerSlot);
  }

  static get slotsLeasePeriod(): IRpcFunctionItem {
    return new RpcConstant(RpcConstantPath.slotsLeasePeriod);
  }

  static get blockHash(): IRpcFunctionItem {
    return new RpcChain(RpcChainPath.blockHash);
  }
}
