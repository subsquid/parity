import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { PhragmenElectionCandidateSlashedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const candidateSlashedHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { candidate } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [candidate]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new PhragmenElectionCandidateSlashedEvent(ctx);
  if (event.isV9010) {
    const [candidate] = event.asV9010;
    return { candidate: toKusamaFormat(candidate) };
  }
  if (event.isV9130) {
    const { candidate } = event.asV9130;
    return {
      candidate: toKusamaFormat(candidate),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
