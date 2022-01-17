import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { AuctionsAuctionStartedEvent } from "../../types/events";
import { CHRONICLE_KEY } from "../../constants";
import { Auction, Chronicle } from "../../model";
import { apiService } from "../utils/api";
import { get, getOrCreate } from "../utils/utils";

type EventType = { auctionId: number; slotStart: number; auctionEnds: number };

export const auctionStartedHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store, block } = ctx;
  const { auctionId, slotStart, auctionEnds } = getEvent(ctx);

  const api = await apiService(block.hash);
  const endingPeriod = api.consts.auctions.endingPeriod.toJSON() as number;
  const leasePeriod = api.consts.slots.leasePeriod.toJSON() as number;
  const periods = api.consts.auctions.leasePeriodsPerSlot.toJSON() as number;

  const auction = await getOrCreate(store, Auction, auctionId.toString());

  auction.blockNum = block.height;
  auction.status = "Started";
  auction.slotsStart = slotStart;
  auction.slotsEnd = slotStart + periods - 1;
  auction.leaseStart = slotStart * leasePeriod;
  auction.leaseEnd = (slotStart + periods - 1) * leasePeriod;
  auction.createdAt = new Date(block.timestamp);
  auction.closingStart = auctionEnds;
  auction.closingEnd = auctionEnds + endingPeriod;
  auction.ongoing = true;
  await store.save(auction);

  const chronicle = await get(store, Chronicle, CHRONICLE_KEY);
  if (!chronicle) {
    console.error("Chronicle not defined. Exiting");
    process.exit(1);
  }
  chronicle.curAuctionId = auctionId.toString();
  await store.save(chronicle);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new AuctionsAuctionStartedEvent(ctx);

  const [auctionId, slotStart, auctionEnds] = event.asLatest;
  return { auctionId, slotStart, auctionEnds };
};
