import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { auctionClosedHandler } from "./auctionClosedHandler";
import { auctionStartedHandler } from "./auctionStartedHandler";
import { bidAcceptedHandler } from "./bidAcceptedHandler";
import { winningOffsetHandler } from "./winningOffsetHandler";

enum AuctionEvents {
  AuctionClosed = "auctions.AuctionClosed",
  AuctionStarted = "auctions.AuctionStarted",
  BidAccepted = "auctions.BidAccepted",
  Reserved = "auctions.Reserved",
  Unreserved = "auctions.Unreserved",
  WinningOffset = "auctions.WinningOffset",
}

export const addAuctionEventsHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(AuctionEvents.AuctionClosed, auctionClosedHandler);
  processor.addEventHandler(
    AuctionEvents.AuctionStarted,
    auctionStartedHandler
  );
  processor.addEventHandler(AuctionEvents.BidAccepted, bidAcceptedHandler);
  processor.addEventHandler(AuctionEvents.WinningOffset, winningOffsetHandler);
};
