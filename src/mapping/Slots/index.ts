import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { leasedHandler } from "./leasedHandler";
import { newLeasedPeriodHandler } from "./newLeasedPeriodHandler";

enum SlotsEvents {
  Leased = "slots.Leased",
  NewLeasePeriod = "slots.NewLeasePeriod",
}

export const addSlotsEventsHandlers = (processor: SubstrateProcessor): void => {
  processor.addEventHandler(SlotsEvents.Leased, leasedHandler);
  processor.addEventHandler(SlotsEvents.NewLeasePeriod, newLeasedPeriodHandler);
};
