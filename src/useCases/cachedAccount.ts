import { Store } from "@subsquid/substrate-processor";
import { DeepPartial, In, IsNull, Not } from "typeorm";
import { CachedAccount } from "../model";
import { deleteMany, findManyAndCount, upsert } from "./common";

export const createOrUpdateCachedAccount = (
  store: Store,
  data: DeepPartial<CachedAccount>
): Promise<CachedAccount> => upsert(store, CachedAccount, data);

export const getManyCachedAccounts = (
  store: Store,
  take: number
): Promise<[CachedAccount[], number]> =>
  findManyAndCount(store, CachedAccount, { relations: ["account"], take });

export const pruneAllCachedAccounts = async (store: Store): Promise<void> => {
  // todo: check it
  // there may be easier solution, like using repository.clear()
  await deleteMany(store, CachedAccount, { accountId: Not(IsNull()) });
};

export const deleteCachesAccounts = async (
  store: Store,
  accountIds: string[]
): Promise<void> => {
  await deleteMany(store, CachedAccount, { accountId: In(accountIds) });
};
