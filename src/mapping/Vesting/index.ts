import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { vestingCompletedHandler } from "./vestingCompletedHandler";
import { vestingUpdatedHandler } from "./vestingUpdatedHandler";

enum VestingEvents {
  VestingCompleted = "vesting.VestingCompleted",
  VestingUpdated = "vesting.VestingUpdated",
}

export const addVestingEventHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(
    VestingEvents.VestingCompleted,
    vestingCompletedHandler
  );
  processor.addEventHandler(
    VestingEvents.VestingUpdated,
    vestingUpdatedHandler
  );
};
