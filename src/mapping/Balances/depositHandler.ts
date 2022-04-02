import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesDepositEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { AccountAddress } from "../../customTypes";
import { storeAccountAndUpdateBalances } from "../../useCases";

type DepositEventType = { who: AccountAddress; amount: bigint };

export const depositHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { who } = getDepositEvent(ctx);
  await storeAccountAndUpdateBalances(store, block, [who]);
};

const getDepositEvent = (ctx: EventHandlerContext): DepositEventType => {
  const event = new BalancesDepositEvent(ctx);
  if (event.isV1032) {
    const [who, amount] = event.asV1032;
    return { who: toKusamaFormat(who), amount };
  }
  const { who, amount } = event.asLatest;
  return { who: toKusamaFormat(who), amount };
};
