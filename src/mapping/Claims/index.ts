import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { claimedHandler } from "./claimed";

enum ClaimsEvents {
  Claimed = "claims.Claimed",
}

export const addClaimedEventsHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(ClaimsEvents.Claimed, claimedHandler);
};
