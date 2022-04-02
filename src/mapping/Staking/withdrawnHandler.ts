import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { StakingWithdrawnEvent } from "../../types/generated/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountAndUpdateBalances } from "../../useCases";

type EventType = { address: AccountAddress; amount: bigint };

export const withdrawnHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { address } = getEvent(ctx);

  await storeAccountAndUpdateBalances(store, block, [address]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new StakingWithdrawnEvent(ctx);

  const [address, amount] = event.asLatest;
  return { address: toKusamaFormat(address), amount };
};
