import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { VestingVestingCompletedEvent } from "../../types/events";
import { getBalance } from "../utils/common";
import { toKusamaFormat } from "../utils/utils";

type EventType = { account: string };

export const vestingCompletedHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store, block } = ctx;
  const { account } = getEvent(ctx);

  const balance = await getBalance(
    account,
    "Vesting Completed",
    store,
    block,
    true
  );
  balance.vestedBalance = 0n;
  await store.save(balance);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new VestingVestingCompletedEvent(ctx);

  return {
    account: toKusamaFormat(
      event.isV1050 ? event.asV1050 : event.asLatest.account
    ),
  };
};
