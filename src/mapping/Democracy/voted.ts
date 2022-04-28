import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { DemocracyVotedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const votedHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { voter } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [voter]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new DemocracyVotedEvent(ctx);

  if (event.isV9160) {
    const { voter } = event.asV9160;
    return {
      voter: toKusamaFormat(voter),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
