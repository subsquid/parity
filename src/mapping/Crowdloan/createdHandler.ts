import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { CrowdloanCreatedEvent } from "../../types/events";
import { ensureFund, ensureParachain } from "../utils/common";

type EventType = { fundId: number };

export const createdHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { fundId } = getEvent(ctx);

  await ensureParachain(fundId, store, block);
  await ensureFund(fundId, store, block, { blockNum: block.height });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new CrowdloanCreatedEvent(ctx);

  return { fundId: event.asLatest };
};
