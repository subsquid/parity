import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { AuctionsWinningOffsetEvent } from "../../types/events";
import { Auction } from "../../model";

type EventType = { auctionId: number; offsetBlock: number };

export const winningOffsetHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store } = ctx;
  const { auctionId, offsetBlock } = getEvent(ctx);

  const auction = await store.find(Auction, {
    where: { id: auctionId.toString() },
  });
  if (!auction) {
    console.log("Auction not defined for handleAuctionWinningOffset");
    process.exit(1);
  }

  if (auction.length) {
    const auctionData = auction[0];
    auctionData.resultBlock = auctionData.closingStart + offsetBlock;
    console.info(
      `Update auction ${auctionId} winning offset: ${auctionData.resultBlock}`
    );
    await store.save(auctionData);
  }
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new AuctionsWinningOffsetEvent(ctx);
  const [auctionId, offsetBlock] = event.asLatest;
  return { auctionId, offsetBlock };
};
