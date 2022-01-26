import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesDustLostEvent } from "../../types/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { AccountAddress } from "../../customTypes";
import { storeAccountAndUpdateBalances } from "../../useCases";

type EventType = { account: AccountAddress; amount: bigint };

export const dustLostHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { account } = getEvent(ctx);

  await storeAccountAndUpdateBalances(store, block, [account]);
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
