import { Store } from "@subsquid/substrate-processor";
import { DeepPartial, ObjectLiteral } from "typeorm";
import { DbCache } from "../model";
import { findByCriteria, upsert } from "./common";

export const getDbCache = <ValueType extends ObjectLiteral>(
  store: Store,
  id: string
): Promise<DbCache<ValueType> | undefined> => {
  return findByCriteria<DbCache<ValueType>>(store, DbCache, {
    where: { id },
  });
};

export const createOrUpdateDbCache = <ValueType extends ObjectLiteral>(
  store: Store,
  data: DbCache<ValueType>
): Promise<DbCache<ValueType>> =>
  upsert<DbCache<ValueType>>(
    store,
    DbCache,
    data as DeepPartial<DbCache<ValueType>>
  );
