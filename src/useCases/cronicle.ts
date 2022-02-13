import { Store } from "@subsquid/substrate-processor";
import { Chronicle } from "../model";
import { findByCriteria, insert, update } from "./common";

const CHRONICLE_ID = "ChronicleId";

export const getChronicle = (store: Store): Promise<Chronicle | undefined> =>
  findByCriteria(store, Chronicle, {
    where: { id: CHRONICLE_ID },
    relations: ["currentAuction"],
  });

export const createChronicle = (store: Store): Promise<void> =>
  insert(store, Chronicle, { id: CHRONICLE_ID });

export const updateChronicle = (
  store: Store,
  data: Partial<Chronicle>
): Promise<void> => update(store, Chronicle, { id: CHRONICLE_ID }, data);
