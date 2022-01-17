import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { deregisteredHandler } from "./deregisteredHandler";
import { registeredHandler } from "./registeredHandler";

enum RegistrarEvents {
  Deregistered = "registrar.Deregistered",
  Registered = "registrar.Registered",
}

export const addRegistrarEventsHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(RegistrarEvents.Deregistered, deregisteredHandler);
  processor.addEventHandler(RegistrarEvents.Registered, registeredHandler);
};
