import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesDepositEvent } from "../../types/events";
import { getBalance } from "../utils/common";
import { toKusamaFormat } from "../utils/utils";

type DepositEventType = { who: string; amount: bigint };

export const depositHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { who: from, amount } = getDepositEvent(ctx);
  const balance = await getBalance(
    from,
    "Balances Deposit",
    store,
    block,
    true
  );

  balance.freeBalance = (balance.freeBalance || 0n) + amount;

  await store.save(balance);
};

const getDepositEvent = (ctx: EventHandlerContext): DepositEventType => {
  const event = new BalancesDepositEvent(ctx);
  if (event.isV1032) {
    const [who, amount] = event.asV1032;
    return { who: toKusamaFormat(who), amount };
  }
  const { who, amount } = event.asLatest;
  return { who: toKusamaFormat(who), amount };
};
