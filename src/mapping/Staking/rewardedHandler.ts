import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { StakingRewardedEvent } from "../../types/generated/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";

type EventType = { address: AccountAddress; amount: bigint };

export const rewardedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { address } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [address]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new StakingRewardedEvent(ctx);

  const [address, amount] = event.asLatest;
  return { address: toKusamaFormat(address), amount };
};
