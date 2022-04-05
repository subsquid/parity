import { BlockHandler } from "@subsquid/substrate-processor";
import { initializeChronicle, initializeKusamaChain } from "../../useCases";

export const initializeSquid: BlockHandler = async ({ store }) => {
  await initializeKusamaChain(store);
  await initializeChronicle(store);
};
