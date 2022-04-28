import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { bountyClaimedHandler } from "./bountyClaimed";

enum BountiesEvents {
  BountyClaimed = "bounties.BountyClaimed",
}

export const addBountiesEventsHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(BountiesEvents.BountyClaimed, bountyClaimedHandler);
};
