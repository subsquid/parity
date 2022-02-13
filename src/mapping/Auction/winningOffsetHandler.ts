import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { AuctionsWinningOffsetEvent } from "../../types/events";
import { createOrUpdateAuction, getAuction } from "../../useCases/auction";
import { NotFoundError } from "../../utils/errors";

type EventType = { auctionIndex: number; blockNumber: number };

export const winningOffsetHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store } = ctx;
  const { auctionIndex, blockNumber } = getEvent(ctx);

  const auction = await getAuction(store, `${auctionIndex}`);

  if (!auction) {
    throw new NotFoundError("Auction", { auctionIndex });
  }
  await createOrUpdateAuction(store, {
    id: `${auctionIndex}`,
    resultBlock: auction.closingStart + blockNumber,
  });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new AuctionsWinningOffsetEvent(ctx);

  if (event.isV9010) {
    const [auctionIndex, blockNumber] = event.asV9010;
    return { auctionIndex, blockNumber };
  }

  const [auctionIndex, blockNumber] = event.asLatest;
  return { auctionIndex, blockNumber };
};
