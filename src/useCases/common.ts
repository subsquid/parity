import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { ObjectID } from "typeorm/driver/mongodb/typings";
import { FindConditions } from "typeorm/find-options/FindConditions";
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";

export const findById = <T>(
  store: Store,
  EntityConstructor: EntityConstructor<T>,
  id: string
): Promise<T | undefined> => {
  return store.getRepository(EntityConstructor).findOne(id);
};

export const findByCriteria = <T>(
  store: Store,
  EntityConstructor: EntityConstructor<T>,
  options?: FindOneOptions<T>
): Promise<T | undefined> => {
  return store.getRepository(EntityConstructor).findOne(options);
};

export const findMany = <T>(
  store: Store,
  EntityConstructor: EntityConstructor<T>,
  options?: FindManyOptions<T>
): Promise<T[]> => {
  return store.getRepository(EntityConstructor).find(options);
};

export const findManyByIds = <T>(
  store: Store,
  EntityConstructor: EntityConstructor<T>,
  ids: string[]
): Promise<T[]> => {
  return store.getRepository(EntityConstructor).findByIds(ids);
};

export const upsert = <T>(
  store: Store,
  EntityConstructor: EntityConstructor<T>,
  data: DeepPartial<T>
): Promise<T> => {
  const entity = new EntityConstructor(data);
  return store.save(entity);
};

export const deleteMany = async <T>(
  store: Store,
  EntityConstructor: EntityConstructor<T>,
  criteria:
    | string
    | string[]
    | number
    | number[]
    | Date
    | Date[]
    | ObjectID
    | ObjectID[]
    | FindConditions<T>
): Promise<void> => {
  // todo; Remake it on repository.clear()?
  await store.getRepository(EntityConstructor).delete(criteria);
};

type EntityConstructor<T> = {
  new (...args: any[]): T;
};
