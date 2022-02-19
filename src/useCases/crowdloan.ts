import { Store, SubstrateBlock } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import _, { omit } from "lodash";
import { Crowdloan } from "../model";
import {
  findByCriteria,
  findById,
  insert,
  insertAndReturn,
  update,
  updateAndReturn,
} from "./common";
import {
  createAddress,
  getBlockTimestampByHeight,
  getCrowdloanInfo,
  getParachainInfo,
} from "../services/apiCalls";
import { convertAddressToSubstrate } from "../utils/addressConvertor";
import { getChain } from "./chain";
import {
  createOrUpdateCrowdloanSequence,
  getCrowdloanSequence,
} from "./crowdloanSequence";
import { getOrCreateKusamaToken } from "./token";
import { timestampToDate } from "../utils/common";
import { NotFoundError } from "../utils/errors";
import { DbCacheAccessor } from "../utils/DbCacheAccessor";
import { calculateCacheKey } from "../services/apiCommon";

export const getCrowdloan = (
  store: Store,
  id: string
): Promise<Crowdloan | undefined> => findById(store, Crowdloan, id);

export const getCrowdloanByParachainId = (
  store: Store,
  parachainId: string
): Promise<Crowdloan | undefined> =>
  findByCriteria(store, Crowdloan, { where: { para: { id: parachainId } } });

export function createCrowdloan(
  store: Store,
  data: Crowdloan,
  shouldReturn: true
): Promise<Crowdloan>;
export function createCrowdloan(store: Store, data: Crowdloan): Promise<void>;
export function createCrowdloan(
  store: Store,
  data: Crowdloan,
  shouldReturn?: boolean
): Promise<Crowdloan | void> {
  return (shouldReturn ? insertAndReturn : insert)(store, Crowdloan, data);
}

export function updateCrowdloanById(
  store: Store,
  id: string,
  data: DeepPartial<Crowdloan>,
  shouldReturn: true
): Promise<Crowdloan>;
export function updateCrowdloanById(
  store: Store,
  id: string,
  data: DeepPartial<Crowdloan>
): Promise<void>;
export function updateCrowdloanById(
  store: Store,
  id: string,
  data: DeepPartial<Crowdloan>,
  shouldReturn?: boolean
): Promise<Crowdloan | void> {
  return (shouldReturn ? updateAndReturn : update)(
    store,
    Crowdloan,
    { id },
    omit(data, "id")
  );
}

/** Mutate CrowdloanSequence */
export const getLatestCrowdloanId = async (
  store: Store,
  parachainId: number, // must be equal to parachainId
  block: SubstrateBlock
): Promise<string> => {
  // const crowdloanSequenceId = `${parachainId}`;
  const crowdloanSequenceId = await getParachainIdWithManager(
    parachainId,
    block,
    store
  );

  let crowdloanSequence = await getCrowdloanSequence(
    store,
    crowdloanSequenceId
  );
  if (!crowdloanSequence) {
    crowdloanSequence = await createOrUpdateCrowdloanSequence(store, {
      id: crowdloanSequenceId,
      curIndex: 0,
      createdAt: timestampToDate(block),
      blockNum: block.height,
    });
  } else {
    const currentIndex = crowdloanSequence.curIndex;
    const crowdloan = await getCrowdloan(
      store,
      `${crowdloanSequenceId}-${currentIndex}`
    );
    const shouldReCreateCrowdloan = !!(
      crowdloan?.won ||
      crowdloan?.dissolvedDate ||
      crowdloan?.dissolve
    );

    if (shouldReCreateCrowdloan) {
      crowdloanSequence = await createOrUpdateCrowdloanSequence(store, {
        id: crowdloanSequenceId,
        curIndex: currentIndex + 1,
        blockNum: block.height,
      });
    }
  }

  return `${crowdloanSequenceId}-${crowdloanSequence.curIndex}`;
};

const getParachainIdWithManager = async (
  paraId: number,
  block: SubstrateBlock,
  store: Store
) => {
  const parachainInfo = await getParachainInfo(store, paraId, block);
  return `${paraId}-${
    parachainInfo?.manager
      ? convertAddressToSubstrate(parachainInfo?.manager || "")
      : ""
  }`;
};

export const ensureCrowdloan = async (
  parachainId: number,
  store: Store,
  block: SubstrateBlock,
  modifier?: Pick<
    Partial<Crowdloan>,
    | "campaignCreateDate"
    | "campaignEndDate"
    | "won"
    | "dissolve"
    | "dissolvedDate"
    | "auctionNumber"
    | "leaseEnd"
    | "leaseStart"
  >
): Promise<Crowdloan | undefined> => {
  const crowdloanId = await getLatestCrowdloanId(store, parachainId, block);

  const crowdloan = await getCrowdloan(store, crowdloanId);

  if (crowdloan) {
    const { cap, end } = await getCrowdloanInfo(store, parachainId, block);
    const leaseEndTimestamp = await getBlockTimestampByHeight(store, end);

    return updateCrowdloanById(
      store,
      crowdloan.id,
      {
        ...crowdloan,
        leaseEnd: leaseEndTimestamp ? new Date(leaseEndTimestamp) : null,
        cap: cap || crowdloan.cap,
        ...modifier,
      },
      true
    );
  }

  // TODO: Change after we integrate multiple tokens
  const token = await getOrCreateKusamaToken(store);
  const parachain = await getChain(store, parachainId);

  if (!parachain) {
    throw new NotFoundError("Parachain", { parachainId });
  }

  const { cap, firstPeriod, lastPeriod, end } = await getCrowdloanInfo(
    store,
    parachainId,
    block
  );

  const leaseEndTimestamp = await getBlockTimestampByHeight(store, end);

  return createCrowdloan(
    store,
    {
      id: crowdloanId,
      para: parachain,
      token,
      slotStart: firstPeriod,
      slotEnd: lastPeriod,
      cap,
      campaignCreateDate: timestampToDate(block),
      won: false,
      dissolve: false,
      leaseEnd: leaseEndTimestamp ? new Date(leaseEndTimestamp) : null,
      contributions: [],
      campaignEndDate: null,
      dissolvedDate: null,
      auctionNumber: null,
      leaseStart: null,
      ...modifier,
    },
    true
  );
};

export const getIsCrowdloanAddress = async (
  store: Store,
  address: string
): Promise<boolean> => {
  const cacheKey = calculateCacheKey({
    localFunction: "getIsCrowdloanAddress",
    args: [address],
  });
  const dbCacheAccessor = new DbCacheAccessor<boolean>(store, cacheKey);
  const cachedValue = await dbCacheAccessor.getValue(cacheKey);
  if (_.isNil(cachedValue)) {
    const hexStr = await createAddress(address);
    const isCrowdloanAddress = Buffer.from(hexStr.slice(4, 28), "hex")
      .toString()
      .startsWith("modlpy/cfund");
    await dbCacheAccessor.setValue(cacheKey, isCrowdloanAddress, 0);
    return isCrowdloanAddress;
  }
  return cachedValue.value;
};
