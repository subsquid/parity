import { ApiDecoration } from "@polkadot/api/types";
import { ApiPromise } from "@polkadot/api";
import { u128 } from "@polkadot/types";
import { HexString } from "@polkadot/util/types";
import _ from "lodash";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import {
  LockId,
  PROVIDER,
  RpcFunctionPaths,
  RpcFunction,
  RpcFunctionType,
} from "../constants";
import { AccountAddress } from "../customTypes";
import { convertAddressToKusama } from "../utils/addressConvertor";
import { parseNumber } from "../utils/common";

let storedApi: ApiPromise | undefined;
let storedApiAtBlock: ApiDecoration<"promise"> | undefined;
let storedLastBlockHash = "-1";

type ApiService = ApiDecoration<"promise">;

const getApiService = async (blockHash?: string): Promise<ApiService> => {
  if (blockHash === storedLastBlockHash) {
    if (!storedApiAtBlock) {
      console.error("RPC connection error", storedLastBlockHash);
      process.exit(1);
    }
    return storedApiAtBlock;
  }
  storedApi = storedApi || (await ApiPromise.create({ provider: PROVIDER }));

  if (!blockHash) {
    return storedApi;
  }

  storedLastBlockHash = blockHash;
  storedApiAtBlock = await storedApi?.at(blockHash);

  if (!storedApiAtBlock) {
    console.error("RPC connection error", storedLastBlockHash);
    process.exit(1);
  }
  return storedApiAtBlock;
};

const getRpcFunction = <Args extends Array<unknown>, Response>(
  apiService: ApiService,
  functionPath: RpcFunctionPaths
) => {
  return _.get(apiService, functionPath) as (
    ...args: Args
  ) => Promise<Response>;
};

export const checkRpcAvailability = (
  { apiService, block }: { apiService?: ApiService; block?: SubstrateBlock },
  rpcFunction: RpcFunctionType,
  throwError?: boolean
): boolean => {
  if (!apiService && !block) {
    throw new Error("Specify [apiService] or [block]!");
  }

  let functionExists = false;

  if (!block) {
    if (apiService) {
      functionExists = !!getRpcFunction(apiService, rpcFunction.path);
    }
  } else if (block.height < rpcFunction.availableAtBlockNumber) {
    functionExists = false;
  } else {
    functionExists = true;
  }

  if (throwError && !functionExists) {
    throw new Error(
      `Function [${rpcFunction.path}] is not available for block [${
        block?.hash || apiService?.registry.createdAtHash?.toString() || "last"
      }]!`
    );
  }

  return functionExists;
};

// https://polkadot.js.org/docs/substrate/storage#number-u32
export const getLastProcessedBlockNumber = async (
  block?: SubstrateBlock
): Promise<number> => {
  const apiService = await getApiService(block?.hash);
  checkRpcAvailability(
    { apiService },
    RpcFunction.lastProcessedBlockNumber,
    true
  );

  const response = await getRpcFunction<[], { toNumber: () => number }>(
    apiService,
    RpcFunction.lastProcessedBlockNumber.path
  )();

  return response.toNumber();
};

export type CrowdloanInfo = {
  cap: bigint;
  depositor: string; // account address in any chain
  deposit: number;
  end: number;
  firstPeriod: number;
  lastContribution: {
    ending: number;
  };
  lastPeriod: number;
  raised: bigint;
  trieIndex: number;
  verifier: {
    sr25519: string; // public key format
  };
};

export const getCrowdloanInfo = async (
  parachainId: number,
  block?: SubstrateBlock
): Promise<CrowdloanInfo | null> => {
  const apiService = await getApiService(block?.hash);
  checkRpcAvailability({ apiService }, RpcFunction.crowdloanInfo, true);

  const response = await getRpcFunction<
    [number],
    {
      toJSON: () => {
        cap: HexString; // u128
        depositor: string; // account address in any chain
        deposit: number;
        end: number;
        firstPeriod: number;
        lastContribution: {
          ending: number;
        };
        lastPeriod: number;
        raised: HexString; // u128
        trieIndex: number;
        verifier: {
          sr25519: string; // public key format
        };
      } | null;
    }
  >(
    apiService,
    RpcFunction.crowdloanInfo.path
  )(parachainId).then((result) => result.toJSON());

  return response
    ? {
        ...response,
        depositor: convertAddressToKusama(response.depositor),
        verifier: {
          ...response.verifier,
          sr25519: convertAddressToKusama(response.verifier.sr25519),
        },
        raised: BigInt(parseNumber(response.raised)),
        cap: BigInt(parseNumber(response.cap)),
      }
    : null;
};

type SystemAccountData = {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: {
    free: bigint | null;
    reserved: bigint | null;
    miscFrozen: bigint | null;
    feeFrozen: bigint | null;
  };
};

export const getSystemAccountInfo = async (
  accountAddress: AccountAddress,
  block?: SubstrateBlock
): Promise<SystemAccountData> => {
  const apiService = await getApiService(block?.hash);
  checkRpcAvailability({ apiService }, RpcFunction.systemAccountInfo, true);

  const response = await getRpcFunction<
    [string],
    {
      nonce: number;
      consumers: number;
      providers: number;
      sufficients: number;
      data: {
        free?: u128;
        reserved?: u128;
        miscFrozen?: u128;
        feeFrozen?: u128;
      };
    }
  >(
    apiService,
    RpcFunction.systemAccountInfo.path
  )(accountAddress);

  return {
    ...response,
    data: {
      free: response.data.free ? BigInt(response.data.free.toJSON()) : null,
      reserved: response.data.reserved
        ? BigInt(response.data.reserved.toJSON())
        : null,
      miscFrozen: response.data.miscFrozen
        ? BigInt(response.data.miscFrozen.toJSON())
        : null,
      feeFrozen: response.data.feeFrozen
        ? BigInt(response.data.feeFrozen.toJSON())
        : null,
    },
  };
};

type LockedBalance = {
  id: LockId;
  amount: bigint;
  reasons: string;
};

export const getLockedBalances = async (
  accountAddress: AccountAddress,
  block?: SubstrateBlock
): Promise<Array<LockedBalance>> => {
  const apiService = await getApiService(block?.hash);
  checkRpcAvailability({ apiService }, RpcFunction.lockedBalances, true);

  const response = await getRpcFunction<
    [string],
    Array<{
      id: Uint8Array;
      amount: u128;
      reasons: string;
    }>
  >(
    apiService,
    RpcFunction.lockedBalances.path
  )(accountAddress);

  const textDecoder = new TextDecoder();
  return response.map(({ id, amount, reasons }) => ({
    id: textDecoder.decode(id) as LockId,
    amount: BigInt(amount.toString()),
    reasons,
  }));
};

export type ParachainInfo = {
  manager: AccountAddress;
  deposit: number;
  locked: boolean;
};

export const getParachainInfo = async (
  parachainId: number,
  block?: SubstrateBlock
): Promise<ParachainInfo | null> => {
  const apiService = await getApiService(block?.hash);
  checkRpcAvailability({ apiService }, RpcFunction.parachainInfo, true);

  const response = await getRpcFunction<
    [number],
    { toJSON: () => ParachainInfo | null }
  >(
    apiService,
    RpcFunction.parachainInfo.path
  )(parachainId).then((result) => result.toJSON());

  return response
    ? {
        ...response,
        manager: convertAddressToKusama(response.manager),
      }
    : null;
};

export const createType = (address: AccountAddress): Promise<HexString> => {
  return getApiService().then((api) =>
    (api as ApiPromise).createType("Address", address).toHex()
  );
};
