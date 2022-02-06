import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { Auction } from "../model";
import { findById, upsert } from "./common";

export const getAuction = (
  store: Store,
  id: string
): Promise<Auction | undefined> => findById(store, Auction, id);

export const createOrUpdateAuction = (
  store: Store,
  data: DeepPartial<Auction>
) => upsert(store, Auction, data);
