import { Store } from "@subsquid/substrate-processor";
import { createKusamaToken } from "./token";
import { createKusamaChain } from "./chain";

export const initializeKusamaChain = async (store: Store): Promise<void> => {
  await createKusamaToken(store);
  await createKusamaChain(store);
};
