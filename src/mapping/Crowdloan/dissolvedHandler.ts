import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { CrowdloanDissolvedEvent } from "../../types/events";
import { timestampToDate } from "../../utils/common";
import { ensureFund } from "../../useCases";

type EventType = { fundIndex: number };

export const dissolveHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { fundIndex } = getEvent(ctx);

  await ensureFund(fundIndex, store, block, {
    dissolvedDate: timestampToDate(block),
  });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new CrowdloanDissolvedEvent(ctx);

  return { fundIndex: event.asLatest };
};
