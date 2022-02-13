import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { CrowdloanDissolvedEvent } from "../../types/events";
import { timestampToDate } from "../../utils/common";
import { ensureCrowdloan } from "../../useCases";

type EventType = { parachainId: number };

export const dissolveHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { parachainId } = getEvent(ctx);

  await ensureCrowdloan(parachainId, store, block, {
    dissolve: true,
    dissolvedDate: timestampToDate(block),
  });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new CrowdloanDissolvedEvent(ctx);

  return { parachainId: event.asLatest };
};
