import { Store } from "@subsquid/substrate-processor";
import { getOrCreateKusamaToken } from "./token";
import { getOrCreateKusamaChain } from "./chain";
import { createChronicle, getChronicle } from "./cronicle";

export const initializeKusamaChain = async (store: Store): Promise<void> => {
  await getOrCreateKusamaToken(store);
  await getOrCreateKusamaChain(store);
};

export const initializeChronicle = async (store: Store): Promise<void> => {
  if (!(await getChronicle(store))) {
    await createChronicle(store);
  }
};
