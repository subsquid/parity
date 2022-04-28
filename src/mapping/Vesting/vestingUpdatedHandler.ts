import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { VestingVestingUpdatedEvent } from "../../types/generated/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";

type EventType = { account: AccountAddress; unvested: bigint };

export const vestingUpdatedHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store, block } = ctx;
  const { account } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [account]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new VestingVestingUpdatedEvent(ctx);

  if (event.isV1050) {
    const [account, unvested] = event.asV1050;
    return { account: toKusamaFormat(account), unvested };
  }
  const { account, unvested } = event.asLatest;
  return { account: toKusamaFormat(account), unvested };
};
