import {
  EventHandler,
  SubstrateProcessor,
} from "@subsquid/substrate-processor";
import { addBalancesEventHandlers } from "./mapping";
import { addRegistrarEventsHandlers } from "./mapping/Registrar";
import { addStakingEventHandlers } from "./mapping/Staking";
import { addVestingEventHandlers } from "./mapping/Vesting";
import { loadGenesisData } from "./mapping/preBlockHooks";
import {
  CHAIN_NODE,
  INDEXER_ENDPOINT_URL,
  PROCESSOR_BATCH_SIZE,
  START_FROM_BLOCK,
} from "./constants";
import {
  logMethodExecutionEnd,
  logMethodExecutionStart,
} from "./useCases/debugMethodExecutionTime";
import { addAuctionEventHandlers } from "./mapping/Auction";
import { addSlotsEventsHandlers } from "./mapping/Slots";
import { addCrowdloanEventsHandlers } from "./mapping/Crowdloan";

const processor = new SubstrateProcessor("kusama_processor");

processor.setTypesBundle("kusama");
processor.setBatchSize(PROCESSOR_BATCH_SIZE);

processor.setDataSource({
  archive: INDEXER_ENDPOINT_URL,
  chain: CHAIN_NODE,
});

processor.setBlockRange({ from: START_FROM_BLOCK });

const patchProcessor = (substrateProcessor: SubstrateProcessor) => {
  const oldAddEventHandler =
    substrateProcessor.addEventHandler.bind(substrateProcessor);
  // @ts-ignore
  substrateProcessor.addEventHandler = (
    eventName: string,
    fn: EventHandler
  ) => {
    oldAddEventHandler(eventName, (async (ctx) => {
      await logMethodExecutionStart(ctx.store, ctx.block, fn.name);
      const usageBefore = process.memoryUsage().heapUsed;
      await fn(ctx);
      const usageAfter = process.memoryUsage().heapUsed;
      await logMethodExecutionEnd(
        ctx.store,
        fn.name,
        ctx.block,
        usageAfter - usageBefore
      );
    }) as EventHandler);
  };
};
// patchProcessor(processor);

addAuctionEventHandlers(processor);
addCrowdloanEventsHandlers(processor);
addRegistrarEventsHandlers(processor);
addSlotsEventsHandlers(processor);

addBalancesEventHandlers(processor);
addStakingEventHandlers(processor);
addVestingEventHandlers(processor);
processor.addPreHook(loadGenesisData);

processor.run();
