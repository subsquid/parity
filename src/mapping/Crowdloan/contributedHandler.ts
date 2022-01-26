import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { CrowdloanContributedEvent } from "../../types/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { AccountAddress } from "../../customTypes";
import {
  createOrUpdateContribution,
  ensureFund,
  getCrowdloan,
  storeAccountAndUpdateBalances,
} from "../../useCases";

type EventType = { who: AccountAddress; fundIndex: number; amount: bigint };

export const contributedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block, event } = ctx;
  const { who, fundIndex: fundIdx, amount } = getEvent(ctx);

  // todo; KRI; Verify this approach
  const fund = await ensureFund(fundIdx, store, block);

  const [contributor] = await storeAccountAndUpdateBalances(store, block, [
    who,
  ]);

  if (!contributor) {
    console.error("Contributor not found");
    process.exit(0);
  }

  // const parachain = fund.parachain
  const crowdloan = await getCrowdloan(store, fund.id);

  if (crowdloan) {
    await createOrUpdateContribution(store, {
      id: `${block.height}-${event.id}`,
      crowdloan,
      account: contributor,
      withdrawal: false,
      amount,
      timestamp: new Date(block.timestamp),
    });
  }
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new CrowdloanContributedEvent(ctx);

  const [who, fundIndex, amount] = event.asLatest;
  return { who: toKusamaFormat(who), fundIndex, amount };
};
