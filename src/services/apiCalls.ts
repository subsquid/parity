import { u128 } from "@polkadot/types";
import { HexString } from "@polkadot/util/types";
import { Store, SubstrateBlock } from "@subsquid/substrate-processor";
import { BlockHash } from "@polkadot/types/interfaces";
import { LockId, RpcFunction } from "../constants";
import { AccountAddress } from "../customTypes";
import { convertAddressToKusama } from "../utils/addressConvertor";
import {
  calculateCacheKey,
  callRpcMulti,
  callRpcOne,
  checkRpcAvailability,
  getActualApiService,
  getApiService,
  getRpcCallableItem,
} from "./apiCommon";
import {
  CrowdloanInfo,
  LockedBalance,
  ParachainInfo,
  SystemAccountData,
} from "./apiTypes";
import { DbCacheAccessor } from "../utils/DbCacheAccessor";

export const getCrowdloanInfo = async (
  store: Store,
  parachainId: number,
  block: SubstrateBlock
): Promise<CrowdloanInfo> => {
  type Response = {
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
    verifier?: {
      sr25519: string; // public key format
    };
  } | null;

  const response = await callRpcOne<[number], Response>(
    () => getApiService({ blockHash: block.hash }),
    RpcFunction.crowdloanInfo,
    [parachainId],
    new DbCacheAccessor<Response>(
      store,
      calculateCacheKey({
        rpcFunction: RpcFunction.crowdloanInfo.path,
        args: [parachainId],
      })
    )
  );

  return response
    ? {
        ...response,
        depositor: convertAddressToKusama(response.depositor),
        verifier: {
          ...response.verifier,
          ...(response.verifier?.sr25519 && {
            sr25519: convertAddressToKusama(response.verifier.sr25519),
          }),
        },
        // todo: Check new approach with BigInt
        // raised: BigInt(parseNumber(response.raised)),
        raised: BigInt(response.raised),
        cap: BigInt(response.cap),
      }
    : ({} as CrowdloanInfo);
};

const zipAccountData = <T>(
  addresses: Array<AccountAddress>,
  dataItems: Array<T>
): Record<AccountAddress, T> => {
  const response: Record<AccountAddress, T> = {};

  if (addresses.length !== dataItems.length) {
    throw new Error(`Account addresses doesn't match provided data items!`);
  }

  for (let idx = 0; idx < addresses.length; idx += 1) {
    if (!addresses[idx]) {
      return response;
    }
    if (!dataItems[idx]) {
      return response;
    }
    response[addresses[idx]] = dataItems[idx];
  }

  return response;
};

export const getSystemAccountInfos = async (
  accountAddresses: AccountAddress[],
  block: SubstrateBlock
): Promise<Record<AccountAddress, SystemAccountData>> => {
  const apiService = await getApiService({ blockHash: block.hash });
  checkRpcAvailability({ apiService }, RpcFunction.systemAccountInfo);
  const response = await callRpcMulti<
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
    accountAddresses.map((accountAddress) => [
      getRpcCallableItem(apiService, RpcFunction.systemAccountInfo),
      accountAddress,
    ]),
    RpcFunction.systemAccountInfo
  );

  const infos = response.map((accountInfo) => ({
    ...accountInfo,
    data: {
      free: accountInfo.data.free
        ? BigInt(accountInfo.data.free.toJSON())
        : null,
      reserved: accountInfo.data.reserved
        ? BigInt(accountInfo.data.reserved.toJSON())
        : null,
      miscFrozen: accountInfo.data.miscFrozen
        ? BigInt(accountInfo.data.miscFrozen.toJSON())
        : null,
      feeFrozen: accountInfo.data.feeFrozen
        ? BigInt(accountInfo.data.feeFrozen.toJSON())
        : null,
    },
  }));

  return zipAccountData(accountAddresses, infos);
};

export const getAccountLockedBalances = async (
  accountAddresses: AccountAddress[],
  block: SubstrateBlock
): Promise<Record<AccountAddress, Array<LockedBalance>>> => {
  const apiService = await getApiService({ blockHash: block.hash });
  checkRpcAvailability({ apiService }, RpcFunction.lockedBalances);

  const response = await callRpcMulti<
    [string],
    Array<{
      id: Uint8Array;
      amount: u128;
      reasons: string;
    }>
  >(
    apiService,
    accountAddresses.map((accountAddress) => [
      getRpcCallableItem(apiService, RpcFunction.lockedBalances),
      accountAddress,
    ]),
    RpcFunction.lockedBalances
  );

  const textDecoder = new TextDecoder();
  const locks = response.map((balancesLocks) =>
    balancesLocks.map(({ id, amount, reasons }) => ({
      id: textDecoder.decode(id) as LockId,
      amount: BigInt(amount.toString()),
      reasons,
    }))
  );
  return zipAccountData(accountAddresses, locks);
};

export const getParachainInfo = async (
  store: Store,
  parachainId: number,
  block: SubstrateBlock
): Promise<ParachainInfo | null> => {
  const response = await callRpcOne<[number], ParachainInfo | null>(
    () => getApiService({ blockHash: block.hash }),
    RpcFunction.parachainInfo,
    [parachainId],
    new DbCacheAccessor<ParachainInfo | null>(
      store,
      calculateCacheKey({
        rpcFunction: RpcFunction.parachainInfo.path,
        args: [parachainId],
      })
    )
  );

  return response
    ? {
        ...response,
        manager: convertAddressToKusama(response.manager),
      }
    : null;
};

// todo; Investigate availability and put it to the RpcFunction class
export const getAuctionEndingPeriod = async (store: Store): Promise<number> => {
  return callRpcOne<[], number>(
    getActualApiService,
    RpcFunction.auctionEndingPeriod,
    [],
    new DbCacheAccessor<number>(
      store,
      calculateCacheKey({ rpcFunction: RpcFunction.auctionEndingPeriod.path })
    )
  );
};

export const getAuctionLeasePeriodsPerSlot = async (
  store: Store
): Promise<number> => {
  return callRpcOne<[], number>(
    getActualApiService,
    RpcFunction.auctionLeasePeriodsPerSlot,
    [],
    new DbCacheAccessor<number>(
      store,
      calculateCacheKey({
        rpcFunction: RpcFunction.auctionLeasePeriodsPerSlot.path,
      })
    )
  );
};

export const getSlotsLeasePeriod = async (store: Store): Promise<number> => {
  return callRpcOne<[], number>(
    getActualApiService,
    RpcFunction.slotsLeasePeriod,
    [],
    new DbCacheAccessor<number>(
      store,
      calculateCacheKey({ rpcFunction: RpcFunction.slotsLeasePeriod.path })
    )
  );
};

export const createAddress = (address: AccountAddress): Promise<HexString> => {
  return getActualApiService().then((api) =>
    api.createType("Address", address).toHex()
  );
};

const getBlockHashByHeight = async (
  store: Store,
  height: number
): Promise<BlockHash> => {
  return callRpcOne<[number], BlockHash>(
    getActualApiService,
    RpcFunction.blockHash,
    [height],
    new DbCacheAccessor<BlockHash>(
      store,
      calculateCacheKey({
        rpcFunction: RpcFunction.blockHash.path,
        args: [height],
      })
    )
  );
};

export const getBlockTimestampByHeight = async (
  store: Store,
  height: number
): Promise<number | null> => {
  const blockHash = await getBlockHashByHeight(store, height);
  return callRpcOne<[], number>(
    () => getApiService({ blockHash }),
    RpcFunction.timestamp,
    [],
    new DbCacheAccessor<number>(
      store,
      calculateCacheKey({
        rpcFunction: RpcFunction.timestamp.path,
        blockHash,
      })
    )
  ).catch(() => null);
};
