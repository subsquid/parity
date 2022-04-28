import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { newTermHandler } from "./newTerm";
import { candidateSlashedHandler } from "./candidateSlashed";
import { seatHolderSlashedHandler } from "./seatHolderSlashed";

enum Events {
  NewTerm = "phragmenElection.NewTerm",
  CandidateSlashed = "phragmenElection.CandidateSlashed",
  SeatHolderSlashed = "phragmenElection.SeatHolderSlashed",
}

export const addPhragmenElectionEventsHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(Events.NewTerm, newTermHandler);
  processor.addEventHandler(Events.CandidateSlashed, candidateSlashedHandler);
  processor.addEventHandler(Events.SeatHolderSlashed, seatHolderSlashedHandler);
};
