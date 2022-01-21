import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesReserveRepatriatedEvent } from "../../types/events";
import * as v9130 from "../../types/v9130";
import { BalanceStatus_Reserved } from "../../types/v9130";
import { accountBalanceTransfer } from "../utils/common";
import { toKusamaFormat } from "../utils/utils";

type EventType = {
  from: string;
  to: string;
  amount: bigint;
  destinationStatus: v9130.BalanceStatus;
};

export const reserveRepatriatedHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { extrinsic, block, store } = ctx;
  const { from, to, amount, destinationStatus } = getEvent(ctx);
  await accountBalanceTransfer(
    from,
    to,
    amount,
    true,
    // todo; Check it; because in v4 it was just without '__kind' property
    isReserved(destinationStatus),
    extrinsic,
    store,
    block
  );
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  console.log("KRI;reserveRepatriatedHandler", JSON.stringify(ctx));
  const event = new BalancesReserveRepatriatedEvent(ctx);
  if (event.asV2008) {
    const [from, to, amount, destinationStatus] = event.asV2008;
    return {
      from: toKusamaFormat(from),
      to: toKusamaFormat(to),
      amount,
      destinationStatus,
    };
  }
  const { from, to, amount, destinationStatus } = event.asV2008;
  return {
    from: toKusamaFormat(from),
    to: toKusamaFormat(to),
    amount,
    destinationStatus,
  };
};

const isReserved = (
  destinationStatus: v9130.BalanceStatus
): destinationStatus is BalanceStatus_Reserved => {
  return destinationStatus.__kind === "Reserved";
};
