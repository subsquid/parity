import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { Bid } from "../model";
import { findById, upsert } from "./common";

export const getBid = (store: Store, id: string): Promise<Bid | undefined> =>
  findById(store, Bid, id);

export const createOrUpdateBid = (
  store: Store,
  data: DeepPartial<Bid>
): Promise<Bid> => upsert(store, Bid, data);
