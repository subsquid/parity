import { Store, SubstrateBlock } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { Chain, Crowdloan } from "../model";
import { findById, upsert } from "./common";
import {
  CrowdloanInfo,
  getCrowdloanInfo,
  getLastProcessedBlockNumber,
  getParachainInfo,
} from "../services/apiCalls";
import { convertAddressToSubstrate } from "../utils/addressConvertor";
import { createOrUpdateKusamaAccount, getAccount } from "./account";
import { createOrUpdateChain, getChain, getKusamaChain } from "./chain";
import {
  createOrUpdateCrowdloanSequence,
  getCrowdloanSequence,
} from "./crowdloanSequence";
import { getKusamaToken } from "./token";
import { timestampToDate } from "../utils/common";

export const getCrowdloan = (
  store: Store,
  id: string
): Promise<Crowdloan | undefined> => findById(store, Crowdloan, id);

export const createOrUpdateCrowdloan = (
  store: Store,
  data: DeepPartial<Crowdloan>
): Promise<Crowdloan> => upsert(store, Crowdloan, data);

export const ensureParachain = async (
  parachainId: number,
  store: Store,
  block: SubstrateBlock
): Promise<Chain> => {
  const chain = await getChain(store, parachainId);

  return createOrUpdateChain(store, {
    id: `${parachainId}`,
    nativeToken: await getKusamaToken(store),
    name: "",
    relayId: await getKusamaChain(store).then(({ id }) => id),
    relayChain: false,
    ...(chain ? {} : { registeredAt: timestampToDate(block) }),
  });
};

const getIsReCreateCrowdloan = async (
  crowdloanId: string,
  store: Store
): Promise<boolean> => {
  const crowdloan = await getCrowdloan(store, crowdloanId);

  return !!(crowdloan?.dissolve && crowdloan?.won);
};

export const getLatestCrowdloanId = async (
  crowdloanSequenceId: string,
  store: Store,
  block: SubstrateBlock
): Promise<string> => {
  const curBlockNum = await getLastProcessedBlockNumber(block);

  const crowdloanSequence = await getCrowdloanSequence(
    store,
    crowdloanSequenceId
  );

  if (crowdloanSequence) {
    const crowdloanIndex = crowdloanSequence.curIndex;
    const isReCreateCrowdloan = await getIsReCreateCrowdloan(
      `${crowdloanSequenceId}-${crowdloanIndex}`,
      store
    );
    let currentIndex = crowdloanIndex;
    if (isReCreateCrowdloan) {
      currentIndex = crowdloanIndex + 1;
      crowdloanSequence.curIndex = currentIndex;
      crowdloanSequence.blockNum = curBlockNum;
      await store.save(crowdloanSequence);
    }

    return `${crowdloanSequenceId}-${currentIndex}`;
  }

  const crowdloan = await createOrUpdateCrowdloanSequence(store, {
    id: crowdloanSequenceId,
    curIndex: 0,
    createdAt: timestampToDate(block),
    blockNum: curBlockNum,
  });

  await store.save(crowdloan);
  return `${crowdloanSequenceId}-0`;
};

const getParachainId = async (paraId: number, block: SubstrateBlock) => {
  let { manager } = (await getParachainInfo(paraId, block)) || {};
  manager = convertAddressToSubstrate(manager || "");
  return `${paraId}-${manager || ""}`;
};

export const ensureFund = async (
  parachainId: number,
  store: Store,
  block: SubstrateBlock,
  modifier?: Partial<Crowdloan>
): Promise<Crowdloan> => {
  const fund = await getCrowdloanInfo(parachainId, block);
  const parachainWithManagerId = await getParachainId(parachainId, block);
  const parachain = await getChain(store, parachainId);

  const crowdloanId = await getLatestCrowdloanId(
    parachainWithManagerId,
    store,
    block
  );
  const {
    cap,
    end,
    trieIndex,
    raised,
    lastContribution,
    firstPeriod,
    lastPeriod,
    depositor,
    verifier,
    ...rest
  } = fund || ({} as CrowdloanInfo);

  const depositorAccount =
    (await getAccount(store, depositor)) ||
    (await createOrUpdateKusamaAccount(store, depositor));

  const verifierAccount = verifier.sr25519
    ? (await getAccount(store, verifier.sr25519)) ||
      (await createOrUpdateKusamaAccount(store, verifier.sr25519))
    : null;

  // TODO: Change after we integrate multiple tokens
  const token = await getKusamaToken(store);

  const crowdloan = await getCrowdloan(store, crowdloanId);
  // todo; think about splitting logic here for insert and update functions
  return createOrUpdateCrowdloan(
    store,
    crowdloan
      ? {
          ...crowdloan,
          cap: cap || crowdloan.cap,
          ...modifier,
        }
      : {
          id: crowdloanId,
          para: parachain,
          token,
          slotStart: firstPeriod,
          slotEnd: lastPeriod,
          cap,
          ...rest,
          ...modifier,
        }
  );
};
