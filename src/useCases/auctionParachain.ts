import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { AuctionParachain } from "../model";
import { findById, upsert } from "./common";

export const getAuctionParachain = (
  store: Store,
  id: string
): Promise<AuctionParachain | undefined> =>
  findById(store, AuctionParachain, id);

export const createOrUpdateAuctionParachain = (
  store: Store,
  data: DeepPartial<AuctionParachain>
): Promise<AuctionParachain> => upsert(store, AuctionParachain, data);
