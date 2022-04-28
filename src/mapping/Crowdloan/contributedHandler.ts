import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { CrowdloanContributedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { AccountAddress } from "../../customTypes";
import {
  createContribution,
  ensureCrowdloan,
  storeAccountToUpdateBalances,
} from "../../useCases";
import { timestampToDate } from "../../utils/common";
import { NotFoundError } from "../../utils/errors";

type EventType = { who: AccountAddress; parachainId: number; amount: bigint };

export const contributedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block, event } = ctx;
  const { who, parachainId, amount } = getEvent(ctx);

  const [account] = await storeAccountToUpdateBalances(store, block, [who]);

  if (!account) {
    throw new NotFoundError("Account", { address: who });
  }

  const crowdloan = await ensureCrowdloan(parachainId, store, block);

  if (!crowdloan?.id) {
    throw new NotFoundError("Crowdloan", { parachainId });
  }

  if (crowdloan) {
    await createContribution(store, {
      id: `${block.height}-${event.id}`,
      crowdloan,
      account,
      amount,
      timestamp: timestampToDate(block),
    });
  }
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new CrowdloanContributedEvent(ctx);

  const [who, parachainId, amount] = event.asLatest;
  return { who: toKusamaFormat(who), parachainId, amount };
};
