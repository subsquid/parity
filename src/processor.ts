import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { addBalancesEventHandlers } from "./mapping";
// import { addCrowdloanEventsHandlers } from "./mapping/Crowdloan";
import { addRegistrarEventsHandlers } from "./mapping/Registrar";
import { addStakingEventHandlers } from "./mapping/Staking";
import { addVestingEventHandlers } from "./mapping/Vesting";
import { loadGenesisData } from "./mapping/preBlockHooks";
import { CHAIN_NODE, INDEXER_ENDPOINT_URL } from "./constants";

const processor = new SubstrateProcessor("kusama_processor");

processor.setTypesBundle("kusama");
processor.setBatchSize(500);

processor.setDataSource({
  archive: INDEXER_ENDPOINT_URL,
  chain: CHAIN_NODE,
});

// processor.setBlockRange({ from: 5000000 });

addBalancesEventHandlers(processor);
// addCrowdloanEventsHandlers(processor);
addRegistrarEventsHandlers(processor);
addStakingEventHandlers(processor);
addVestingEventHandlers(processor);
processor.addPreHook(loadGenesisData);

processor.run();
