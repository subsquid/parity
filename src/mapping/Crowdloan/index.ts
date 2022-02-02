import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { createdHandler } from "./createdHandler";
import { contributedHandler } from "./contributedHandler";
import { dissolveHandler } from "./dissolvedHandler";

enum CrowdloanEvents {
  Created = "crowdloan.Created",
  Contributed = "crowdloan.Contributed",
  Dissolved = "crowdloan.Dissolved",
}

export const addCrowdloanEventsHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(CrowdloanEvents.Created, createdHandler);
  processor.addEventHandler(CrowdloanEvents.Contributed, contributedHandler);
  processor.addEventHandler(CrowdloanEvents.Dissolved, dissolveHandler);
};
