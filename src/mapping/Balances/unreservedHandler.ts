import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesUnreservedEvent } from "../../types/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountAndUpdateBalances } from "../../useCases";

type EventType = { who: AccountAddress; amount: bigint };

export const unreservedHandler: EventHandler = async (ctx): Promise<void> => {
  const { block, store } = ctx;
  const { who } = getEvent(ctx);

  await storeAccountAndUpdateBalances(store, block, [who]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new BalancesUnreservedEvent(ctx);

  if (event.isV2008) {
    const [who, amount] = event.asV2008;
    return { who: toKusamaFormat(who), amount };
  }
  const { who, amount } = event.asLatest;
  return { who: toKusamaFormat(who), amount };
};
