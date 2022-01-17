import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesReservedEvent } from "../../types/events";
import { getBalance } from "../utils/common";
import { toKusamaFormat } from "../utils/utils";

type EventType = { who: string; amount: bigint };

export const reservedHandler: EventHandler = async (ctx): Promise<void> => {
  const { block, store } = ctx;
  const { who: from, amount } = getEvent(ctx);

  const balance = await getBalance(
    from,
    "Balances Reserved",
    store,
    block,
    true
  );

  balance.bondedBalance = (balance.bondedBalance || 0n) + amount;
  balance.freeBalance = (balance.freeBalance || 0n) - amount;

  await store.save(balance);
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
