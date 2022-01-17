import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { VestingVestingUpdatedEvent } from "../../types/events";
import { getBalance } from "../utils/common";
import { toKusamaFormat } from "../utils/utils";

type EventType = { account: string; unvested: bigint };

export const vestingUpdatedHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store, block } = ctx;
  const { account, unvested: vestingBalance } = getEvent(ctx);

  const address = account.toString();
  const balance = await getBalance(
    address,
    "Vesting Updated",
    store,
    block,
    true
  );
  balance.vestedBalance = vestingBalance;
  await store.save(balance);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new VestingVestingUpdatedEvent(ctx);

  if (event.isV1050) {
    const [account, unvested] = event.asV1050;
    return { account: toKusamaFormat(account), unvested };
  }
  const { account, unvested } = event.asLatest;
  return { account: toKusamaFormat(account), unvested };
};
