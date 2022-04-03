import { Store } from "@subsquid/substrate-processor";
import { HistoricalBalance } from "../model";
import { insert } from "./common";

export function createHistoricalBalance(
  store: Store,
  data: HistoricalBalance
): Promise<HistoricalBalance | void> {
  return insert(store, HistoricalBalance, data);
}
