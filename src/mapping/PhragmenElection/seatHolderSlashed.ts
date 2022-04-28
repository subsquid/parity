import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { PhragmenElectionSeatHolderSlashedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const seatHolderSlashedHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { seatHolder } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [seatHolder]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new PhragmenElectionSeatHolderSlashedEvent(ctx);
  if (event.isV9010) {
    const [seatHolder] = event.asV9010;
    return { seatHolder: toKusamaFormat(seatHolder) };
  }
  if (event.isV9130) {
    const { seatHolder } = event.asV9130;
    return {
      seatHolder: toKusamaFormat(seatHolder),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
