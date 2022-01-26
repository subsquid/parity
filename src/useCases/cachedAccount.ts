import { Store } from "@subsquid/substrate-processor";
import { DeepPartial, IsNull, Not } from "typeorm";
import { CachedAccount } from "../model";
import { deleteMany, findMany, upsert } from "./common";

export const createOrUpdateCachedAccount = (
  store: Store,
  data: DeepPartial<CachedAccount>
): Promise<CachedAccount> => upsert(store, CachedAccount, data);

export const getAllCachedAccounts = (store: Store): Promise<CachedAccount[]> =>
  findMany(store, CachedAccount, { relations: ["account"] });

export const pruneAllCachedAccounts = async (store: Store): Promise<void> => {
  // todo: check it
  // there may be easier solution, like using repository.clear()
  await deleteMany(store, CachedAccount, { accountId: Not(IsNull()) });
};
