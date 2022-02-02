import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { boundedHandler } from "./boundedHandler";
import { unboundedHandler } from "./unboundedHandler";
import { rewardedHandler } from "./rewardedHandler";
import { slashedHandler } from "./slashedHandler";
import { withdrawnHandler } from "./withdrawnHandler";

enum StakingEvents {
  Bonded = "staking.Bonded",
  Rewarded = "staking.Rewarded",
  Slashed = "staking.Slashed",
  Unbonded = "staking.Unbonded",
  Withdrawn = "staking.Withdrawn",
}

export const addStakingEventHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(StakingEvents.Bonded, boundedHandler);
  processor.addEventHandler(StakingEvents.Rewarded, rewardedHandler);
  processor.addEventHandler(StakingEvents.Slashed, slashedHandler);
  processor.addEventHandler(StakingEvents.Unbonded, unboundedHandler);
  processor.addEventHandler(StakingEvents.Withdrawn, withdrawnHandler);
};
