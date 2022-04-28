import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { StakingKickedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const kickedHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { who, stash } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [who, stash]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new StakingKickedEvent(ctx);
  if (event.isV2028) {
    const [who, stash] = event.asV2028;
    return { who: toKusamaFormat(who), stash: toKusamaFormat(stash) };
  }

  throw new UnknownVersionError(event.constructor.name);
};
