import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { RegistrarDeregisteredEvent } from "../../types/events";
import { getChain, updateChainById } from "../../useCases";
import { timestampToDate } from "../../utils/common";

type EventType = { parachainId: number };

export const deregisteredHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { parachainId } = getEvent(ctx);

  const chain = await getChain(store, parachainId);

  if (!chain) {
    // throw new NotFoundError("Chain", { parachainId });
    return;
  }

  await updateChainById(store, `${parachainId}`, {
    ...chain,
    deregisteredAt: timestampToDate(block),
  });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new RegistrarDeregisteredEvent(ctx);

  return { parachainId: event.asLatest };
};
