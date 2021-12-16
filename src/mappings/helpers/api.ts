import {
  PROVIDER,
  INDEXER,
  API_RETRIES,
  QUERY_CACHE_SIZE,
} from "../../constants";
import axios, { AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import { ApiPromise } from "@polkadot/api";
import { ApiDecoration } from "@polkadot/api/types";
import { constructCache } from "./common";

axiosRetry(axios, {
  retries: API_RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
});
let api: ApiPromise | undefined;
let apiAtBlock: ApiDecoration<"promise"> | undefined;
let lastBlockHash = "-1";

let blockEventCache: Map<string, Array<BlockEvent>> = new Map();
let blockExtrinsicsCache: Map<string, Array<BlockExtrinisic>> = new Map();

export interface BlockEvent {
  section: string;
  method: string;
  id: string;
  data: any;
  blockHash: string;
  params: any;
  name: string;
  indexInBlock: any;
  blockNumber: string;
  blockTimestamp: any;
  extrinsicId?: string;
}

export interface BlockExtrinisic {
  section: string;
  method: string;
  id: string;
  signer: string;
  args: any;
  indexInBlock: number;
  tip: bigint;
  signature: string;
  hash: string;
  name: string;
  blockNumber: string;
  substrate_events: [
    {
      name: string;
      id: string;
    }
  ];
}

export const apiService = async (
  blockHash?: string
): Promise<ApiDecoration<"promise">> => {
  if (blockHash === lastBlockHash) {
    if (!apiAtBlock) {
      console.error("RPC connection error", lastBlockHash);
      process.exit(1);
    }
    return apiAtBlock;
  }
  api = api || (await ApiPromise.create({ provider: PROVIDER }));
  if (!blockHash) return api;
  lastBlockHash = blockHash;
  apiAtBlock = await api?.at(blockHash);
  if (!apiAtBlock) {
    console.error("RPC connection error", lastBlockHash);
    process.exit(1);
  }
  return apiAtBlock;
};

export const axiosPOSTRequest = async (data: any, indexer = INDEXER) => {
  const config: AxiosRequestConfig = {
    method: "post",
    url: indexer,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

/**
 * API to fetch all block events
 * @param {number} blockNumber
 * @param {number} query cache size
 * @returns {Array<BlockEvent>}
 */
export const allBlockEvents = async (
  blockNumber: number,
  size = QUERY_CACHE_SIZE
): Promise<Array<BlockEvent>> => {
  if (blockEventCache.has(`${blockNumber}`)) {
    return blockEventCache.get(`${blockNumber}`) || [];
  }
  // Clear cache
  blockEventCache = new Map();
  // please be cautions when modifying query, extra spaces line endings could cause query not to work
  const query = `query MyQuery {
  substrate_event (where:  {_and: [{blockNumber: {_gte: ${blockNumber}}},{blockNumber: {_lte: ${
    blockNumber + size
  }}}]}){
    section
    extrinsicId
    method
    id
    data
    blockHash
    params
    name
    blockNumber
    indexInBlock
    blockNumber
    blockTimestamp
  }
}`;
  let data = JSON.stringify({
    query,
    variables: {},
  });

  let events = await axiosPOSTRequest(data).then((result: any) => {
    const response: Array<BlockEvent> = result?.data?.substrate_event;
    return response;
  });
  blockEventCache = constructCache<BlockEvent>(events);

  return blockEventCache.get(`${blockNumber}`) || [];
};

/**
 *  API to fetch all block extrinsics with blocknumber
 * @param {number} blockNumber
 * @param {number} query cache size
 */
export const allBlockExtrinsics = async (
  blockNumber: number,
  size = QUERY_CACHE_SIZE
): Promise<Array<BlockExtrinisic> | []> => {
  if (blockExtrinsicsCache.has(`${blockNumber}`)) {
    return blockExtrinsicsCache.get(`${blockNumber}`) || [];
  }
  // Clear cache
  blockExtrinsicsCache = new Map();
  // please be cautions when modifying query, extra spaces line endings could cause query not to work
  const query = `query MyQuery {
  substrate_extrinsic(where:  {_and: [{blockNumber: {_gte: ${blockNumber}}},{blockNumber: {_lte: ${
    blockNumber + size
  }}}]}){
    section
    signer
    method
    id
    name
    args
    hash
    indexInBlock
    tip
    signature
    blockNumber
    hash
    substrate_events {
      name
      id
    }
  }
}
`;
  let data = JSON.stringify({
    query,
    variables: {},
  });

  let extrinsics = await axiosPOSTRequest(data).then(
    (result: any) => result?.data?.substrate_extrinsic
  );
  blockExtrinsicsCache = constructCache<BlockExtrinisic>(extrinsics);

  return blockExtrinsicsCache.get(`${blockNumber}`) || [];
};
