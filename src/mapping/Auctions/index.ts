import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { auctionStartedHandler } from "./auctionStartedHandler";
import { auctionClosedHandler } from "./auctionClosedHandler";
import { bidAcceptedHandler } from "./bidAcceptedHandler";
import { winningOffsetHandler } from "./winningOffsetHandler";

enum AuctionEvents {
  AuctionStarted = "auctions.AuctionStarted",
  AuctionClosed = "auctions.AuctionClosed",
  WonDeploy = "auctions.WonDeploy", // add handler
  Reserved = "auctions.Reserved", // add handler
  Unreserved = "auctions.Unreserved", // add handler
  BidAccepted = "auctions.BidAccepted",
  WinningOffset = "auctions.WinningOffset",
}

export const addAuctionEventHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(
    AuctionEvents.AuctionStarted,
    auctionStartedHandler
  );
  processor.addEventHandler(AuctionEvents.AuctionClosed, auctionClosedHandler);
  processor.addEventHandler(AuctionEvents.BidAccepted, bidAcceptedHandler);
  processor.addEventHandler(AuctionEvents.WinningOffset, winningOffsetHandler);
};
