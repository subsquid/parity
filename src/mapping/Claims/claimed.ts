import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { ClaimsClaimedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const claimedHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { who } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [who]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new ClaimsClaimedEvent(ctx);
  if (event.isV1020) {
    const [who] = event.asV1020;
    return { who: toKusamaFormat(who) };
  }

  throw new UnknownVersionError(event.constructor.name);
};
