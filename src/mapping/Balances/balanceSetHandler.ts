import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesBalanceSetEvent } from "../../types/generated/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";

type BalanceSetEvent = { who: AccountAddress; free: bigint; reserved: bigint };

export const balanceSetHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { who } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [who]);
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
