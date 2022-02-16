import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { SlotsLeasedEvent } from "../../types/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { getIsCrowdloanAddress, updateCrowdloanById } from "../../useCases";
import { getChronicle } from "../../useCases/cronicle";
import { NotFoundError } from "../../utils/errors";

type EventType = {
  parachainId: number;
  leaser: AccountAddress;
  periodBegin: number;
  periodCount: number;
  extraReserved: bigint;
  totalAmount: bigint;
};

export const leasedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store } = ctx;
  const { parachainId, leaser } = getEvent(ctx);

  const chronicle = await getChronicle(store);

  if (!chronicle?.currentAuction) {
    // It is possible, to enter this event handler BEFORE an auction created. So, just skip it.
    return;
  }

  if (await getIsCrowdloanAddress(leaser)) {
    await updateCrowdloanById(store, `${parachainId}`, {
      auctionNumber: +chronicle.currentAuction.id,
      leaseEnd: chronicle.currentAuction.leaseEnd,
    });
  }
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new SlotsLeasedEvent(ctx);

  if (event.isV9010) {
    const [
      parachainId,
      leaser,
      periodBegin,
      periodCount,
      extraReserved,
      totalAmount,
    ] = event.asV9010;
    return {
      parachainId,
      leaser: toKusamaFormat(leaser),
      periodBegin,
      periodCount,
      extraReserved,
      totalAmount,
    };
  }
  const [
    parachainId,
    leaser,
    periodBegin,
    periodCount,
    extraReserved,
    totalAmount,
  ] = event.asLatest;
  return {
    parachainId,
    leaser: toKusamaFormat(leaser),
    periodBegin,
    periodCount,
    extraReserved,
    totalAmount,
  };
};
