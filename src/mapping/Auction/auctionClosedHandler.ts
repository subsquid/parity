import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { AuctionsAuctionClosedEvent } from "../../types/events";
import { Auction, Chronicle } from "../../model";
import { CHRONICLE_KEY } from "../../constants";
import { get } from "../utils/utils";

type EventType = { auctionId: number };

export const auctionClosedHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store, block } = ctx;
  const { auctionId } = getEvent(ctx);

  const auction = await get(store, Auction, auctionId.toString());
  if (!auction) {
    console.error("Auction not defined. Exiting");
    process.exit(1);
  }

  auction.blockNum = block.height;
  auction.status = "Closed";
  auction.ongoing = false;

  await store.save(auction);

  const chronicle = await get(store, Chronicle, CHRONICLE_KEY);
  if (!chronicle) {
    console.error("Chronicle not defined. Exiting");
    process.exit(1);
  }
  chronicle.curAuctionId = null;
  await store.save(chronicle);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new AuctionsAuctionClosedEvent(ctx);

  return { auctionId: event.asLatest };
};
