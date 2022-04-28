import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { bidPlacedHandler } from "./bidPlaced";
import { bidRetractedHandler } from "./bidRetracted";
import { giltIssuedHandler } from "./giltIssued";
import { giltThawedHandler } from "./giltThawed";

enum Events {
  BidPlaced = "gilt.BidPlaced",
  BidRetracted = "gilt.BidRetracted",
  GiltIssued = "gilt.GiltIssued",
  GiltThawed = "gilt.GiltThawed",
}

export const addGiltEventsHandlers = (processor: SubstrateProcessor): void => {
  processor.addEventHandler(Events.BidPlaced, bidPlacedHandler);
  processor.addEventHandler(Events.BidRetracted, bidRetractedHandler);
  processor.addEventHandler(Events.GiltIssued, giltIssuedHandler);
  processor.addEventHandler(Events.GiltThawed, giltThawedHandler);
};
