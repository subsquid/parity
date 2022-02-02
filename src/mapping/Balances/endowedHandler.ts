import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesEndowedEvent } from "../../types/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountAndUpdateBalances } from "../../useCases";

type EventType = { account: AccountAddress; freeBalance: bigint };

export const endowedHandler: EventHandler = async (ctx): Promise<void> => {
  const { block, store } = ctx;
  const { account } = getEvent(ctx);

  await storeAccountAndUpdateBalances(store, block, [account]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new BalancesEndowedEvent(ctx);
  if (event.isV1050) {
    const [account, freeBalance] = event.asV1050;
    return { account: toKusamaFormat(account), freeBalance };
  }
  const { account, freeBalance } = event.asLatest;
  return { account: toKusamaFormat(account), freeBalance };
};
