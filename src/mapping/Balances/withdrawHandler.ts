import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesWithdrawEvent } from "../../types/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountAndUpdateBalances } from "../../useCases";

type EventType = { who: AccountAddress; amount: bigint };

export const withdrawHandler: EventHandler = async (ctx): Promise<void> => {
  const { block, store } = ctx;
  const { who } = getEvent(ctx);

  await storeAccountAndUpdateBalances(store, block, [who]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new BalancesWithdrawEvent(ctx);

  if (event.isV9122) {
    const [who, amount] = event.asV9122;
    return { who: toKusamaFormat(who), amount };
  }
  const { who, amount } = event.asLatest;
  return { who: toKusamaFormat(who), amount };
};
