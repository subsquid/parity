import {
  EventHandler,
  SubstrateProcessor,
} from "@subsquid/substrate-processor";
import { addBalancesEventHandlers } from "./mapping";
// import { addCrowdloanEventsHandlers } from "./mapping/Crowdloan";
import { addRegistrarEventsHandlers } from "./mapping/Registrar";
import { addStakingEventHandlers } from "./mapping/Staking";
import { addVestingEventHandlers } from "./mapping/Vesting";
import { loadGenesisData } from "./mapping/preBlockHooks";
import {
  CHAIN_NODE,
  INDEXER_ENDPOINT_URL,
  START_FROM_BLOCK,
} from "./constants";
import {
  logMethodExecutionEnd,
  logMethodExecutionStart,
} from "./useCases/debugMethodExecutionTime";

const processor = new SubstrateProcessor("kusama_processor");

processor.setTypesBundle("kusama");
processor.setBatchSize(500);

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
patchProcessor(processor);

addBalancesEventHandlers(processor);
// addCrowdloanEventsHandlers(processor);
addRegistrarEventsHandlers(processor);
addStakingEventHandlers(processor);
addVestingEventHandlers(processor);
processor.addPreHook(loadGenesisData);

processor.run();
