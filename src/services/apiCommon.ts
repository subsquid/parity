import _ from "lodash";
import { ApiPromise } from "@polkadot/api";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import { BlockHash } from "@polkadot/types/interfaces";
import { FunctionIsNotAvailableError } from "../utils/errors";
import { IRpcFunctionItem, PROVIDER } from "../constants";
import { ApiService, JsonConvertable } from "./apiTypes";
import { DbCacheAccessor } from "../utils/DbCacheAccessor";

let cachedApi: ApiService;

export const getActualApiService = (): Promise<ApiPromise> => {
  return ApiPromise.create({ provider: PROVIDER });
};

export const getApiService = async ({
  blockHash,
}: {
  blockHash?: string | BlockHash;
}): Promise<ApiService> => {
  const api = await getActualApiService();
  if (blockHash) {
    cachedApi = await api.at(blockHash);
    if (!cachedApi) {
      throw new Error(`RPC connection error ${blockHash.toString()}`);
    }
    return cachedApi;
  }
  return api;
};

export const getRpcCallableItem = <
  Args extends Array<unknown>,
  Response = unknown
>(
  apiService: ApiService,
  { path }: IRpcFunctionItem
): ((...args: Args) => Promise<Response>) => {
  return _.get(apiService, path) as (...args: Args) => Promise<Response>;
};

export const getRpcNonCallableItem = <Response = unknown>(
  apiService: ApiService,
  { path }: IRpcFunctionItem
): Response => {
  return _.get(apiService, path) as Response;
};

export const callRpcOne = async <
  Args extends Array<unknown>,
  Response = unknown
>(
  // since this function may be cached it would be more optimal to access apiService on demand
  apiServiceAccessor: () => ApiService | Promise<ApiService>,
  rpcFunction: IRpcFunctionItem,
  args: Args,
  cacheAccessor?: DbCacheAccessor<Response>
): Promise<Response> => {
  const getActualResult = async (apiService: ApiService) => {
    checkRpcAvailability({ apiService }, rpcFunction);
    if (rpcFunction.callable) {
      return getRpcCallableItem<Args, JsonConvertable<Response>>(
        apiService,
        rpcFunction
      )(...args).then((response) => response.toJSON());
    }
    return getRpcNonCallableItem<JsonConvertable<Response>>(
      apiService,
      rpcFunction
    ).toJSON();
  };

  if (rpcFunction.cache) {
    if (!cacheAccessor) {
      throw new Error("Cache accessor is not provided!");
    }
    const cacheKey =
      cacheAccessor?.customKey ||
      calculateCacheKey({
        rpcFunction: rpcFunction.path,
        blockHash: (await apiServiceAccessor()).registry.createdAtHash,
        args,
      });
    const cachedData = await cacheAccessor.getValue(cacheKey);
    // if there is not cached data, or it is obsolete
    // then refresh cache and return fresh value
    if (
      _.isNil(cachedData) ||
      (rpcFunction.cacheLimit &&
        rpcFunction.cacheLimit <= cachedData.readCounter)
    ) {
      const actualValue = await getActualResult(await apiServiceAccessor());
      await cacheAccessor.setValue(
        cacheKey,
        actualValue,
        cachedData ? cachedData.readCounter + 1 : 0
      );
      return actualValue;
    }

    return cachedData.value;
  }
  return getActualResult(await apiServiceAccessor());
};

const getRpcMulti = async <Args extends unknown[], Response>(
  apiService: ApiService,
  queries: Array<[(...args: Args) => Promise<Response>, ...Args]>
): Promise<Array<Response>> => {
  return (await apiService.queryMulti(
    // todo get rid of ts-ignore
    // @ts-ignore
    queries
  )) as unknown as Array<Response>;
};

export const callRpcMulti = async <Args extends unknown[], Response>(
  apiService: ApiService,
  queries: Array<[(...args: Args) => Promise<Response>, ...Args]>,
  { path }: IRpcFunctionItem
): Promise<Response[]> => {
  const startTime = new Date();
  const logExecuted = () => {
    console.log(
      `Function [${path}] was called ${queries.length} times and took ${
        new Date().valueOf() - startTime.valueOf()
      } milliseconds;`
    );
  };

  console.log(`Call function [${path}] for [${queries.length}] queries.`);
  return getRpcMulti<Args, Response>(apiService, queries)
    .then((result) => {
      logExecuted();
      return result;
    })
    .catch((error) => {
      logExecuted();
      throw error;
    });
};

export const checkRpcAvailability = (
  { apiService, block }: { apiService?: ApiService; block?: SubstrateBlock },
  functionType: IRpcFunctionItem,
  throwError = true
): boolean => {
  if (!apiService && !block) {
    throw new Error("Specify [apiService] or [block]!");
  }

  let functionExists: boolean;

  if (apiService) {
    functionExists = !!getRpcCallableItem(apiService, functionType);
  } else if (block) {
    if (functionType.availableAtBlockNumber === "last") {
      functionExists = false;
    } else {
      functionExists = block.height >= functionType.availableAtBlockNumber;
    }
  } else {
    functionExists = false;
  }

  if (throwError && !functionExists) {
    throw new FunctionIsNotAvailableError(
      functionType.path,
      block?.hash || apiService?.registry.createdAtHash?.toString() || "last"
    );
  }

  return functionExists;
};

export const calculateCacheKey = (options: {
  rpcFunction?: string;
  localFunction?: string;
  blockHash?: BlockHash | string;
  args?: Array<unknown>;
}): string => {
  return JSON.stringify(options);
};
