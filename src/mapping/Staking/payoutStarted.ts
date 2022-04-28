import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { StakingPayoutStartedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const payoutStartedHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { stash } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [stash]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new StakingPayoutStartedEvent(ctx);
  if (event.isV9090) {
    const [eraIndex, stash] = event.asV9090;
    return { stash: toKusamaFormat(stash) };
  }

  throw new UnknownVersionError(event.constructor.name);
};
