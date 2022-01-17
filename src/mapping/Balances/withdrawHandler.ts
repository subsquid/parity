import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesWithdrawEvent } from "../../types/events";
import { getBalance } from "../utils/common";
import { toKusamaFormat } from "../utils/utils";

type EventType = { who: string; amount: bigint };

export const withdrawHandler: EventHandler = async (ctx): Promise<void> => {
  const { block, store } = ctx;
  const { who: from, amount } = getEvent(ctx);

  const balance = await getBalance(
    from,
    "Balances withdraw",
    store,
    block,
    true
  );

  balance.freeBalance = (balance.freeBalance || 0n) - amount;

  await store.save(balance);
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
