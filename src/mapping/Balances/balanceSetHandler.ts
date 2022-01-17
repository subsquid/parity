import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesBalanceSetEvent } from "../../types/events";
import { getBalance } from "../utils/common";
import { cacheNewAccountEvents } from "../utils/cacheNewAccountEvents";
import { toKusamaFormat } from "../utils/utils";

type BalanceSetEvent = { who: string; free: bigint; reserved: bigint };

export const balanceSetHandler: EventHandler = async (ctx) => {
  const { store, block, extrinsic } = ctx;

  const { who: to, free: balance } = getEvent(ctx);
  const blockNumber = block.height;

  const newAccountEvent = cacheNewAccountEvents[blockNumber]?.[to];

  if (newAccountEvent?.extrinsicId === extrinsic?.id) {
    // already processed in new account, skipping
    return;
  }

  const balanceTo = await getBalance(to, "Balance Set Event", store, block);

  balanceTo.freeBalance = (balanceTo.freeBalance || 0n) + balance;
  await store.save(balanceTo);
};

const getEvent = (ctx: EventHandlerContext): BalanceSetEvent => {
  const event = new BalancesBalanceSetEvent(ctx);
  if (event.isV1031) {
    const [who, free, reserved] = event.asV1031;
    return { who: toKusamaFormat(who), free, reserved };
  }
  const { who, free, reserved } = event.asLatest;
  return { who: toKusamaFormat(who), free, reserved };
};
