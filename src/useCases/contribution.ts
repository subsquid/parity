import { Store } from "@subsquid/substrate-processor";
import { Contribution } from "../model";
import { insert } from "./common";

export const createContribution = (
  store: Store,
  data: Contribution
): Promise<void> => insert(store, Contribution, data);
