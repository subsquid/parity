import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { boundedHandler } from "./boundedHandler";
import { unboundedHandler } from "./unboundedHandler";

enum StakingEvents {
  Bonded = "staking.Bonded",
  Unbonded = "staking.Unbonded",
}

export const addStakingEventHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(StakingEvents.Bonded, boundedHandler);
  processor.addEventHandler(StakingEvents.Unbonded, unboundedHandler);
};
