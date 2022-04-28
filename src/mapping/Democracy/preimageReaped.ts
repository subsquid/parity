import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { DemocracyPreimageReapedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const preimageReapedHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { provider, reaper } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [provider, reaper]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new DemocracyPreimageReapedEvent(ctx);
  if (event.isV1022) {
    const [proposalHash, provider, deposit, reaper] = event.asV1022;
    return {
      provider: toKusamaFormat(provider),
      reaper: toKusamaFormat(reaper),
    };
  }
  if (event.isV9130) {
    const { provider, reaper } = event.asV9130;
    return {
      provider: toKusamaFormat(provider),
      reaper: toKusamaFormat(reaper),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
