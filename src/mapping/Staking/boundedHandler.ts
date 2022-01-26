import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { StakingBondedEvent } from "../../types/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountAndUpdateBalances } from "../../useCases";

type EventType = { address: AccountAddress; amount: bigint };

export const boundedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { address } = getEvent(ctx);

  await storeAccountAndUpdateBalances(store, block, [address]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new StakingBondedEvent(ctx);

  const [address, amount] = event.asLatest;
  return { address: toKusamaFormat(address), amount };
};
