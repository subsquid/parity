import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { addBalancesEventHandlers } from "./mapping";
import { addAuctionEventsHandlers } from "./mapping/Auction";
import { addCrowdloanEventsHandlers } from "./mapping/Crowdloan";
import { addRegistrarEventsHandlers } from "./mapping/Registrar";
import { addSlotsEventsHandlers } from "./mapping/Slots";
import { addStakingEventHandlers } from "./mapping/Staking";
import { addVestingEventHandlers } from "./mapping/Vesting";
import { loadGenesisData } from "./mapping/preBlockHooks";

const processor = new SubstrateProcessor("kusama_balances");

processor.setTypesBundle("kusama");
processor.setBatchSize(500);

processor.setDataSource({
  archive: process.env.INDEXER_ENDPOINT_URL as string,
  chain: process.env.CHAIN_NODE as string,
});

// processor.setBlockRange({ from: 7796877 });

addAuctionEventsHandlers(processor);
addBalancesEventHandlers(processor);
addCrowdloanEventsHandlers(processor);
addRegistrarEventsHandlers(processor);
addSlotsEventsHandlers(processor);
addStakingEventHandlers(processor);
addVestingEventHandlers(processor);
processor.addPreHook(loadGenesisData);

processor.run();