import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { SocietyAutoUnbidEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const autoUnbidHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { candidate } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [candidate]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new SocietyAutoUnbidEvent(ctx);
  if (event.isV1040) {
    const candidate = event.asV1040;
    return { candidate: toKusamaFormat(candidate) };
  }
  if (event.isV9160) {
    const { candidate } = event.asV9160;
    return {
      candidate: toKusamaFormat(candidate),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
