import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { SocietyVoteEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const voteHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { candidate, voter } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [candidate, voter]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new SocietyVoteEvent(ctx);
  if (event.isV1040) {
    const [candidate, voter] = event.asV1040;
    return {
      candidate: toKusamaFormat(candidate),
      voter: toKusamaFormat(voter),
    };
  }
  if (event.isV9160) {
    const { candidate, voter } = event.asV9160;
    return {
      candidate: toKusamaFormat(candidate),
      voter: toKusamaFormat(voter),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
