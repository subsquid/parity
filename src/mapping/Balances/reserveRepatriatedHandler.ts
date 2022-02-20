import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesReserveRepatriatedEvent } from "../../types/events";
import * as v9130 from "../../types/v9130";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountAndUpdateBalances } from "../../useCases";

type EventType = {
  from: string;
  to: string;
  amount: bigint;
  destinationStatus: v9130.BalanceStatus;
};

export const reserveRepatriatedHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { block, store } = ctx;
  const { from, to } = getEvent(ctx);

  await storeAccountAndUpdateBalances(store, block, [from, to]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new BalancesReserveRepatriatedEvent(ctx);
  if (event.isV2008) {
    const [from, to, amount, destinationStatus] = event.asV2008;
    return {
      from: toKusamaFormat(from),
      to: toKusamaFormat(to),
      amount,
      destinationStatus,
    };
  }
  const { from, to, amount, destinationStatus } = event.asLatest;
  return {
    from: toKusamaFormat(from),
    to: toKusamaFormat(to),
    amount,
    destinationStatus,
  };
};
