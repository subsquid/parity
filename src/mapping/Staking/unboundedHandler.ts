import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { StakingUnbondedEvent } from "../../types/events";
import { getBalance } from "../utils/common";
import { toKusamaFormat } from "../utils/utils";

type EventType = { address: string; amount: bigint };

export const unboundedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { address, amount } = getEvent(ctx);

  const balance = await getBalance(
    address,
    "Staking UnBonded",
    store,
    block,
    true
  );
  balance.bondedBalance = balance.bondedBalance || 0n - amount;
  await store.save(balance);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new StakingUnbondedEvent(ctx);

  const [address, amount] = event.asLatest;
  return { address: toKusamaFormat(address), amount };
};
