import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { VestingVestingCompletedEvent } from "../../types/generated/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";

type EventType = { account: AccountAddress };

export const vestingCompletedHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store, block } = ctx;
  const { account } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [account]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new VestingVestingCompletedEvent(ctx);

  return {
    account: toKusamaFormat(
      event.isV1050 ? event.asV1050 : event.asLatest.account
    ),
  };
};
