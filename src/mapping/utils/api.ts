import axios from "axios";

import { ApiPromise } from "@polkadot/api";
import { ApiDecoration } from "@polkadot/api/types";
import axiosRetry from "axios-retry";
import { API_RETRIES, PROVIDER } from "../../constants";

axiosRetry(axios, {
  retries: API_RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
});
let api: ApiPromise | undefined;
let apiAtBlock: ApiDecoration<"promise"> | undefined;
let lastBlockHash = "-1";

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
