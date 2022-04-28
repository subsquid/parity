import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BountiesBountyClaimedEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const bountyClaimedHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { beneficiary } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [beneficiary]);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new BountiesBountyClaimedEvent(ctx);
  if (event.isV2028) {
    const [index, payout, beneficiary] = event.asV2028;
    return { beneficiary: toKusamaFormat(beneficiary) };
  }
  if (event.isV9130) {
    const { beneficiary } = event.asV9130;
    return { beneficiary: toKusamaFormat(beneficiary) };
  }

  throw new UnknownVersionError(event.constructor.name);
};
