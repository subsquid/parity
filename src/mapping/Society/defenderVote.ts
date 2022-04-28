import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { SocietyDefenderVoteEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const defenderVoteHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { voter } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [voter]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new SocietyDefenderVoteEvent(ctx);
  if (event.isV1040) {
    const [voter] = event.asV1040;
    return {
      voter: toKusamaFormat(voter),
    };
  }
  if (event.isV9160) {
    const { voter } = event.asV9160;
    return {
      voter: toKusamaFormat(voter),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
