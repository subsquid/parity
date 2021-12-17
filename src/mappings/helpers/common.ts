import { DatabaseManager, SubstrateBlock } from "@subsquid/hydra-common";
import { encodeAddress } from "@polkadot/util-crypto";
import { apiService, BlockEvent, BlockExtrinisic } from "./api";
import { Auction } from "../../generated/model/auction.model";
import { AuctionParachain } from "../../generated/model/auctionParachain.model";
import { Bid } from "../../generated/model/bid.model";
import { Crowdloan } from "../../generated/model/crowdloan.model";
import { CrowdloanSequence } from "../../generated/model/crowdloanSequence.model";
import { Chains } from "../../generated/model/chains.model";
import { ParachainLeases } from "../../generated/model/parachainLeases.model";
import { ParachainReturn, CrowdloanReturn } from "./types";
import {
  fetchCrowdloan,
  getParachainId,
  parseNumber,
  parseBigInt,
} from "./utils";
import { CROWDLOAN_STATUS, RELAY_CHAIN_DETAILS } from "../../constants";
import { ApiPromise } from "@polkadot/api";
import {
  createAccountIfNotPresent,
  setAndGetRelayChain,
  setAndGetTokenDetails,
} from "..";

type EntityConstructor<T> = {
  new (...args: any[]): T;
};
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

export const timestampToDate = (block: SubstrateBlock): Date => {
  return new Date(block.timestamp);
};

export const getOrCreate = async <T extends { id: string }>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string
): Promise<T> => {
  let e = await store.get(entityConstructor, {
    where: { id },
  });

  if (e == null) {
    e = new entityConstructor();
    e.id = id;
  }

  return e;
};

export const get = async <T extends { id: string }>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string,
  query?: any
): Promise<T | null> => {
  let e = await store.get(entityConstructor, {
    where: !query ? { id } : query,
  });

  return e || null;
};

export const getOrUpdate = async <T>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string,
  newValues: Record<string, any>,
  updateFn?: (entry?: T) => Omit<T, "save">
): Promise<T> => {
  let e: any = await store.get(entityConstructor, {
    where: { id },
  });
  const updatedItem = e
    ? updateFn
      ? updateFn(e)
      : { ...e, ...newValues, id }
    : updateFn
    ? updateFn()
    : { ...newValues, id };
  e = e || new entityConstructor({ id });
  for (const property in updatedItem) {
    e[property] = updatedItem[property];
  }

  await store.save(e);
  return e;
};

export function constructCache<T extends BlockExtrinisic | BlockEvent>(
  list: Array<T>
): Map<string, Array<T>> {
  let cache: Map<string, Array<T>> = new Map();
  list.map((element: T) => {
    let array = cache.get(`${element.blockNumber}`) || [];
    array?.push(element);
    cache.set(`${element.blockNumber}`, array);
  });
  return cache;
}

export function convertAddressToSubstrate(address: string): string {
  return (address && encodeAddress(address, 42)) || "";
}

/**
 * @shalabh add description
 * @param address
 * @returns
 */
export const isFundAddress = async (address: string) => {
  let api = (await apiService()) as ApiPromise;
  const hexStr = api.createType("Address", address).toHex();
  return Buffer.from(hexStr.slice(4, 28), "hex")
    .toString()
    .startsWith("modlpy/cfund");
};

export const fetchParachain = async (
  paraId: number,
  block: SubstrateBlock
): Promise<ParachainReturn | null> => {
  const api = await apiService(block.hash);
  const parachain = (
    await api.query.registrar.paras(paraId)
  ).toJSON() as unknown;

  return parachain as ParachainReturn | null;
};

export const ensureParachain = async (
  paraId: number,
  store: DatabaseManager,
  block: SubstrateBlock
): Promise<Chains> => {
  const { manager, deposit } = (await fetchParachain(paraId, block)) || {
    manager: "",
    deposit: "",
  };
  const address = convertAddressToSubstrate(manager);
  const managerAccount = await createAccountIfNotPresent(address, store, block);
  const parachainId = `${paraId}-${address}`;
  const relayChain = await setAndGetRelayChain(store);
  return await getOrUpdate<Chains>(store, Chains, parachainId, {
    id: parachainId,
    paraId,
    creationBlock: block.height,
    manager: managerAccount,
    relayId: RELAY_CHAIN_DETAILS.relayId,
    relayChain: false,
    deposit: deposit,
    deregistered: false,
  });
};

export const getIsReCreateCrowdloan = async (
  fundId: string,
  store: DatabaseManager
): Promise<Boolean> => {
  const [fund] = await await store.find(Crowdloan, {
    where: { id: fundId },
  });
  const isReCreateCrowdloan = !!(
    fund?.dissolvedBlock &&
    fund?.status === CROWDLOAN_STATUS.DISSOLVED &&
    fund?.isFinished
  );

  return isReCreateCrowdloan;
};

export const getLatestCrowdloanId = async (
  parachainId: string,
  store: DatabaseManager,
  block: SubstrateBlock
) => {
  const api = await apiService(block.hash);
  const [seq] = await store.find(CrowdloanSequence, {
    where: { id: parachainId },
  });
  const curBlockNum = await api.query.system.number();
  if (seq) {
    const crowdloanIdx = seq.curIndex;
    const isReCreateCrowdloan = await getIsReCreateCrowdloan(
      `${parachainId}-${crowdloanIdx}`,
      store
    );
    let curIdex = crowdloanIdx;
    if (isReCreateCrowdloan) {
      curIdex = crowdloanIdx + 1;
      seq.curIndex = curIdex;
      seq.blockNum = curBlockNum.toNumber();
      await store.save(seq);
    }

    return `${parachainId}-${curIdex}`;
  }

  const crowdloan = new CrowdloanSequence({
    id: parachainId,
    curIndex: 0,
    createdAt: new Date(),
    blockNum: curBlockNum.toNumber(),
  });
  await store.save(crowdloan);
  return `${parachainId}-0`;
};

export const ensureFund = async (
  paraId: number,
  store: DatabaseManager,
  block: SubstrateBlock,
  modifier?: Record<string, any>
): Promise<Crowdloan> => {
  const fund = await fetchCrowdloan(paraId, block);
  const parachainId = await getParachainId(paraId, block);
  const parachain = await store.find(Chains, {
    where: { id: parachainId },
    take: 1,
  });

  const fundId = await getLatestCrowdloanId(parachainId, store, block);
  const {
    cap,
    end,
    trieIndex,
    raised,
    lastContribution,
    firstPeriod,
    lastPeriod,
    ...rest
  } = fund || ({} as CrowdloanReturn);

  const test: any = null;
  rest.depositor = await createAccountIfNotPresent(
    convertAddressToSubstrate(rest.depositor.id),
    store,
    block
  );
  rest.verifier =
    rest.verifier == null
      ? null
      : await createAccountIfNotPresent(
          convertAddressToSubstrate(rest.verifier.id),
          store,
          block
        );
  // TODO: Change after we integrate multiple tokens
  const token = await setAndGetTokenDetails(store);
  return getOrUpdate<Crowdloan>(store, Crowdloan, fundId, test, (cur: any) => {
    return !cur
      ? new Crowdloan({
          id: fundId,
          paraId: paraId,
          tokenId: token,
          parachain: parachain[0],
          ...rest,
          firstSlot: firstPeriod,
          lastSlot: lastPeriod,
          status: CROWDLOAN_STATUS.STARTED,
          raised: parseNumber(raised) as unknown as bigint,
          cap: parseNumber(cap) as unknown as bigint,
          lockExpiredBlock: end,
          isFinished: false,
          ...modifier,
        })
      : new Crowdloan({
          ...cur,
          raised:
            raised === undefined
              ? (parseBigInt(cur.raised) as unknown as bigint)
              : (parseNumber(raised) as unknown as bigint),
          cap:
            cap === undefined
              ? (parseBigInt(cur.cap) as unknown as bigint)
              : (parseNumber(cap) as unknown as bigint),
          ...modifier,
        });
  });
};

export const getAuctionsByOngoing = async (
  store: DatabaseManager,
  ongoing: boolean
): Promise<Auction[] | undefined> => {
  const records = await store.find(Auction, {
    where: { ongoing: true },
    take: 1,
  });
  return records.map((record) => create(record, Auction)) as Auction[];
};

export const getByLeaseRange = async (
  store: DatabaseManager,
  leaseRange: string
): Promise<ParachainLeases[] | undefined> => {
  const records = await store.find(ParachainLeases, {
    where: { leaseRange },
    take: 1,
  });

  return records.map((record: any) => create(record, ParachainLeases));
};

export const getByWinningAuction = async (
  store: DatabaseManager,
  winningAuction: number
): Promise<Bid[] | undefined> => {
  const records = await store.find(Bid, {
    where: { winningAuction },
    take: 1,
  });

  return records.map((record: any) => create(record, Bid));
};

export const getByAuctionParachain = async (
  store: DatabaseManager,
  id: string
): Promise<AuctionParachain[] | undefined> => {
  const records = await store.find(AuctionParachain, {
    where: { id },
    take: 1,
  });

  return records.map((record: any) => create(record, AuctionParachain));
};

export const getByAuctions = async (
  store: DatabaseManager,
  id: string
): Promise<Auction[] | undefined> => {
  const records = await store.find(Auction, {
    where: { id },
    take: 1,
  });

  if (records) {
    return records.map((record: any) => create(record, Auction));
  } else {
    return;
  }
};

export const create = <T>(
  record: any,
  entityConstructor: EntityConstructor<T>
) => {
  let entity = new entityConstructor(record.id);
  Object.assign(entity, record);

  return entity;
};
