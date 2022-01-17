import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesDustLostEvent } from "../../types/events";
import { getBalance } from "../utils/common";
import { toKusamaFormat } from "../utils/utils";

type EventType = { account: string; amount: bigint };

export const dustLostHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { account: from } = getEvent(ctx);

  const balance = await getBalance(
    from,
    "Balances DustLost",
    store,
    block,
    true
  );

  balance.bondedBalance = 0n;
  balance.vestedBalance = 0n;
  balance.freeBalance = 0n;

  await store.save(balance);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new BalancesDustLostEvent(ctx);

  if (event.isV1050) {
    const [account, amount] = event.asV1050;
    return { account: toKusamaFormat(account), amount };
  }
  const { account, amount } = event.asLatest;
  return { account: toKusamaFormat(account), amount };
};
