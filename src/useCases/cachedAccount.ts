import { Store, SubstrateBlock } from "@subsquid/substrate-processor";
import { DeepPartial, In } from "typeorm";
import { FindConditions } from "typeorm/find-options/FindConditions";
import { CachedAccount } from "../model";
import { deleteMany, findManyAndCount, update, upsert } from "./common";
import { timestampToDate } from "../utils/common";

export const createOrUpdateCachedAccount = (
  store: Store,
  data: DeepPartial<CachedAccount>
): Promise<CachedAccount> => upsert(store, CachedAccount, data);

export const getManyCachedAccounts = (
  store: Store,
  criteria: FindConditions<CachedAccount>,
  take: number
): Promise<[CachedAccount[], number]> =>
  findManyAndCount(store, CachedAccount, {
    relations: ["account"],
    take,
    where: criteria,
  });

export const deleteCachesAccounts = async (
  store: Store,
  accountIds: string[]
): Promise<void> => {
  await deleteMany(store, CachedAccount, { accountId: In(accountIds) });
};

export const blacklistCachedAccounts = (
  store: Store,
  accountIds: string[],
  block: SubstrateBlock
): Promise<void> =>
  update(
    store,
    CachedAccount,
    { accountId: In(accountIds) },
    {
      blacklistedAtBlockTimestamp: timestampToDate(block),
      blacklistedAtBlockHeight: block.height,
    }
  );
