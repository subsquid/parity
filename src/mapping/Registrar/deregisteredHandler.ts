import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { RegistrarDeregisteredEvent } from "../../types/events";
import { createOrUpdateChain } from "../../useCases";
import { timestampToDate } from "../../utils/common";

type EventType = { paraId: number };

export const deregisteredHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { paraId } = getEvent(ctx);

  await createOrUpdateChain(store, {
    id: `${paraId}`,
    deregisteredAt: timestampToDate(block),
  });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new RegistrarDeregisteredEvent(ctx);

  return { paraId: event.asLatest };
};
