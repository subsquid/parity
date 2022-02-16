import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { AuctionsAuctionStartedEvent } from "../../types/events";
import { createOrUpdateAuction } from "../../useCases/auction";
import { updateChronicle } from "../../useCases/cronicle";
import {
  getAuctionEndingPeriod,
  getAuctionLeasePeriodsPerSlot,
  getSlotsLeasePeriod,
} from "../../services/apiCalls";
import { AuctionStatus } from "../../constants";

type EventType = {
  auctionIndex: number;
  leasePeriodOf: number;
  blockNumber: number;
};

export const auctionStartedHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store, block } = ctx;
  const { auctionIndex, leasePeriodOf, blockNumber } = getEvent(ctx);

  const endingPeriod = await getAuctionEndingPeriod(store);
  const leasePeriod = await getSlotsLeasePeriod(store);
  const leasePeriodsPerSlot = await getAuctionLeasePeriodsPerSlot(store);

  const auction = await createOrUpdateAuction(store, {
    id: `${auctionIndex}`,
    blockNum: block.height,
    status: AuctionStatus.Started,
    slotsStart: leasePeriodOf,
    slotsEnd: leasePeriodOf + leasePeriodsPerSlot - 1,
    leaseStart: leasePeriodOf * leasePeriod,
    leaseEnd: (leasePeriodOf + leasePeriodsPerSlot - 1) * leasePeriod,
    closingStart: blockNumber,
    ongoing: true,
    closingEnd: blockNumber + endingPeriod,
  });

  await updateChronicle(store, {
    currentAuction: auction,
  });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new AuctionsAuctionStartedEvent(ctx);

  if (event.isV9010) {
    const [auctionIndex, leasePeriodOf, blockNumber] = event.asV9010;
    return { auctionIndex, leasePeriodOf, blockNumber };
  }
  const [auctionIndex, leasePeriodOf, blockNumber] = event.asLatest;
  return { auctionIndex, leasePeriodOf, blockNumber };
};
