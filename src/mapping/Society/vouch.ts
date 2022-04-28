import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { SocietyVouchEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const vouchHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { candidateId } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [candidateId]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new SocietyVouchEvent(ctx);
  if (event.isV1040) {
    const [candidateId] = event.asV1040;
    return { candidateId: toKusamaFormat(candidateId) };
  }
  if (event.isV9160) {
    const { candidateId } = event.asV9160;
    return {
      candidateId: toKusamaFormat(candidateId),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
