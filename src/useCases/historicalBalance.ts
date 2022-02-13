import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { HistoricalBalance } from "../model";
import { upsert } from "./common";

export const createOrUpdateHistoricalBalance = (
  store: Store,
  data: DeepPartial<HistoricalBalance>
): Promise<HistoricalBalance> => upsert(store, HistoricalBalance, data);
