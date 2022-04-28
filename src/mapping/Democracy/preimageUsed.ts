import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { DemocracyPreimageUsedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const preimageUsedHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { provider } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [provider]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new DemocracyPreimageUsedEvent(ctx);
  if (event.isV1022) {
    const [proposalHash, provider] = event.asV1022;
    return {
      provider: toKusamaFormat(provider),
    };
  }
  if (event.isV9130) {
    const { provider } = event.asV9130;
    return {
      provider: toKusamaFormat(provider),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
