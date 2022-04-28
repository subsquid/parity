import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { tabledHandler } from "./tabled";
import { preimageReapedHandler } from "./preimageReaped";
import { votedHandler } from "./voted";
import { preimageUsedHandler } from "./preimageUsed";
import { preimageNotedHandler } from "./preimageNoted";

enum Events {
  Tabled = "democracy.Tabled",
  PreimageNoted = "democracy.PreimageNoted",
  PreimageUsed = "democracy.PreimageUsed",
  PreimageReaped = "democracy.PreimageReaped",
  Voted = "democracy.Voted",
}

export const addDemocracyEventsHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(Events.Tabled, tabledHandler);
  processor.addEventHandler(Events.PreimageNoted, preimageNotedHandler);
  processor.addEventHandler(Events.PreimageUsed, preimageUsedHandler);
  processor.addEventHandler(Events.PreimageReaped, preimageReapedHandler);
  processor.addEventHandler(Events.Voted, votedHandler);
};
