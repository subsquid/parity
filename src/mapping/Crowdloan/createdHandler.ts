import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { CrowdloanCreatedEvent } from "../../types/generated/events";
import { ensureCrowdloan, createOrUpdateParachain } from "../../useCases";
import { timestampToDate } from "../../utils/common";

type EventType = { chainId: number };

export const createdHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { chainId } = getEvent(ctx);

  await createOrUpdateParachain(store, chainId, block);
  await ensureCrowdloan(chainId, store, block, {
    campaignCreateDate: timestampToDate(block),
  });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new CrowdloanCreatedEvent(ctx);

  return { chainId: event.asLatest };
};
