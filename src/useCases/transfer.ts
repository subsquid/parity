import { Store } from "@subsquid/substrate-processor";
import { insert } from "./common";
import { Transfer } from "../model";

export const createTransfer = (store: Store, data: Transfer): Promise<void> =>
  insert(store, Transfer, data);
