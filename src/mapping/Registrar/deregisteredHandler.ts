import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { RegistrarDeregisteredEvent } from "../../types/events";
import { Chains } from "../../model";
import { get } from "../utils/utils";

type EventType = { paraId: number };

export const deregisteredHandler: EventHandler = async (ctx): Promise<void> => {
  const { store } = ctx;
  const { paraId } = getEvent(ctx);

  const chain = await get(store, Chains, "", { paraId });
  if (chain === undefined || chain === null) {
    console.log("Chain not found with paraId ", paraId);
    return;
  }
  chain.deregistered = true;
  await store.save(chain);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new RegistrarDeregisteredEvent(ctx);

  return { paraId: event.asLatest };
};
