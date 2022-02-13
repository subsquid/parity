import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { leasedHandler } from "./leasedHandler";

enum SlotsEvents {
  Leased = "slots.Leased",
}

export const addSlotsEventsHandlers = (processor: SubstrateProcessor): void => {
  processor.addEventHandler(SlotsEvents.Leased, leasedHandler);
};
