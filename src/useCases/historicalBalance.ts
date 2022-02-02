import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { HistoricalBalance } from "../model";
import { findById, upsert } from "./common";

export const getHistoricalBalance = (
  store: Store,
  id: string
): Promise<HistoricalBalance | undefined> =>
  findById(store, HistoricalBalance, id);

export const createOrUpdateHistoricalBalance = (
  store: Store,
  data: DeepPartial<HistoricalBalance>
): Promise<HistoricalBalance> => upsert(store, HistoricalBalance, data);
