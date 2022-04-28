import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { StakingChilledEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const chilledHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { who } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [who]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new StakingChilledEvent(ctx);
  if (event.isV9090) {
    const who = event.asV9090;
    return { who: toKusamaFormat(who) };
  }

  throw new UnknownVersionError(event.constructor.name);
};
