import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { addBalancesEventHandlers } from "./mapping";
import { addRegistrarEventsHandlers } from "./mapping/Registrar";
import { addStakingEventHandlers } from "./mapping/Staking";
import { addVestingEventHandlers } from "./mapping/Vesting";
import { initializeSquid } from "./mapping/preBlockHooks";
import {
  CHAIN_NODE,
  INDEXER_ENDPOINT_URL,
  PROCESSOR_BATCH_SIZE,
  START_FROM_BLOCK,
} from "./constants";
import { addAuctionEventHandlers } from "./mapping/Auctions";
import { addSlotsEventsHandlers } from "./mapping/Slots";
import { addCrowdloanEventsHandlers } from "./mapping/Crowdloan";
import { updateBalances } from "./useCases";

const processor = new SubstrateProcessor("kusama_processor");

processor.setTypesBundle("kusama");
processor.setBatchSize(PROCESSOR_BATCH_SIZE);

processor.setDataSource({
  archive: INDEXER_ENDPOINT_URL,
  chain: CHAIN_NODE,
});

processor.setBlockRange({ from: START_FROM_BLOCK });

addAuctionEventHandlers(processor);
addCrowdloanEventsHandlers(processor);
addRegistrarEventsHandlers(processor);
addSlotsEventsHandlers(processor);

addBalancesEventHandlers(processor);
addStakingEventHandlers(processor);
addVestingEventHandlers(processor);
processor.addPreHook({ range: { from: 1, to: 1 } }, initializeSquid);
processor.addPreHook({ range: { from: 3000000 } }, updateBalances);

processor.run();
