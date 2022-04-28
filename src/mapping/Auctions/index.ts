import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { auctionStartedHandler } from "./auctionStartedHandler";
import { auctionClosedHandler } from "./auctionClosedHandler";
import { bidAcceptedHandler } from "./bidAcceptedHandler";
import { winningOffsetHandler } from "./winningOffsetHandler";
import { reservedHandler } from "./Reserved";
import { unreservedHandler } from "./Unreserved";

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
  processor.addEventHandler(AuctionEvents.Reserved, reservedHandler);
  processor.addEventHandler(AuctionEvents.Unreserved, unreservedHandler);
  processor.addEventHandler(AuctionEvents.BidAccepted, bidAcceptedHandler);
  processor.addEventHandler(AuctionEvents.WinningOffset, winningOffsetHandler);
};
