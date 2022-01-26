import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { findById, upsert } from "./common";
import { Transfer } from "../model";

export const getTransfer = (
  store: Store,
  id: string
): Promise<Transfer | undefined> => findById(store, Transfer, id);

export const createOrUpdateTransfer = (
  store: Store,
  data: DeepPartial<Transfer>
): Promise<Transfer> => upsert(store, Transfer, data);
