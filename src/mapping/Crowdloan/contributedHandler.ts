import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { CrowdloanContributedEvent } from "../../types/events";
import { Contribution, Crowdloan } from "../../model";
import {
  createAccountIfNotPresent,
  ensureFund,
  ensureParachain,
} from "../utils/common";
import { convertAddressToSubstrate, get, toKusamaFormat } from "../utils/utils";

type EventType = { who: string; fundIndex: number; amount: bigint };

export const contributedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block, event } = ctx;
  const { who: contributorId, fundIndex: fundIdx, amount } = getEvent(ctx);

  const blockNum = block.height;

  const parachain = await ensureParachain(fundIdx, store, block);

  const fund = await ensureFund(fundIdx, store, block);
  const fundId = fund.id;

  const [contributor] = await createAccountIfNotPresent(
    convertAddressToSubstrate(contributorId),
    store,
    block
  );
  if (!contributor) {
    console.error("Contributor not found", contributorId);
    process.exit(0);
  }
  // const parachain = fund.parachain
  const crowdLoan = await get(store, Crowdloan, fundId);
  if (crowdLoan) {
    const contribution = new Contribution({
      id: `${blockNum}-${event.id}`,
      crowdloanId: crowdLoan.id,
      account: contributor,
      parachain,
      fund: crowdLoan,
      amount,
      timestamp: new Date(block.timestamp),
      blockNum,
    });

    await store.save(contribution);
  }
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new CrowdloanContributedEvent(ctx);

  const [who, fundIndex, amount] = event.asLatest;
  return { who: toKusamaFormat(who), fundIndex, amount };
};
