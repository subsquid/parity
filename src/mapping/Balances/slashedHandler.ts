import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesSlashedEvent } from "../../types/generated/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountAndUpdateBalances } from "../../useCases";

type EventType = { who: AccountAddress; amount: bigint };

export const slashedHandler: EventHandler = async (ctx): Promise<void> => {
  const { block, store } = ctx;
  const { who } = getEvent(ctx);

  await storeAccountAndUpdateBalances(store, block, [who]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new BalancesSlashedEvent(ctx);
  if (event.isV9122) {
    const [who, amount] = event.asV9122;
    return { who: toKusamaFormat(who), amount };
  }
  const { who, amount } = event.asLatest;
  return { who: toKusamaFormat(who), amount };
};
