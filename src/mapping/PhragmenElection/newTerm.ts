import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { PhragmenElectionNewTermEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const newTermHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { newMembers } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, newMembers);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new PhragmenElectionNewTermEvent(ctx);
  if (event.isV9010) {
    const newMembers = event.asV9010;
    return {
      newMembers: newMembers.map(([newMember]) => toKusamaFormat(newMember)),
    };
  }
  if (event.isV9130) {
    const { newMembers } = event.asV9130;
    return {
      newMembers: newMembers.map(([newMember]) => toKusamaFormat(newMember)),
    };
  }

  throw new UnknownVersionError(event.constructor.name);
};
