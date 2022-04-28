import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { GiltBidPlacedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const bidPlacedHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { who } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [who]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new GiltBidPlacedEvent(ctx);
  if (event.isV9010) {
    const [who] = event.asV9010;
    return {
      who: toKusamaFormat(who),
    };
  }
  if (event.isV9130) {
    const { who } = event.asV9130;
    return {
      who: toKusamaFormat(who),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
