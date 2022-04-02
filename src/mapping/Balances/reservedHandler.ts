import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesReservedEvent } from "../../types/generated/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountAndUpdateBalances } from "../../useCases";

type EventType = { who: AccountAddress; amount: bigint };

export const reservedHandler: EventHandler = async (ctx): Promise<void> => {
  const { block, store } = ctx;
  const { who } = getEvent(ctx);

  await storeAccountAndUpdateBalances(store, block, [who]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new BalancesReservedEvent(ctx);
  if (event.isV2008) {
    const [who, amount] = event.asV2008;
    return { who: toKusamaFormat(who), amount };
  }
  const { who, amount } = event.asLatest;
  return { who: toKusamaFormat(who), amount };
};
