import { SubstrateProcessor } from "@subsquid/substrate-processor";
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
import { addAuctionEventHandlers } from "./mapping/Auctions";
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

addAuctionEventHandlers(processor);
addCrowdloanEventsHandlers(processor);
addRegistrarEventsHandlers(processor);
addSlotsEventsHandlers(processor);

addBalancesEventHandlers(processor);
addStakingEventHandlers(processor);
addVestingEventHandlers(processor);
processor.addPreHook({ range: { from: 1, to: 1 } }, loadGenesisData);

processor.run();
