import { DatabaseManager, SubstrateBlock } from "@subsquid/hydra-common";
import { encodeAddress } from "@polkadot/util-crypto";
import { BlockEvent, BlockExtrinisic } from "./api";

type EntityConstructor<T> = {
  new (...args: any[]): T;
};
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

export const timestampToDate = (block: SubstrateBlock): Date => {
  return new Date(block.timestamp);
};

export const getOrCreate = async <T extends { id: string }>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string
): Promise<T> => {
  let e = await store.get(entityConstructor, {
    where: { id },
  });

  if (e == null) {
    e = new entityConstructor();
    e.id = id;
  }

  return e;
};

export const get = async <T extends { id: string }>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string
): Promise<T | null> => {
  let e = await store.get(entityConstructor, {
    where: { id },
  });

  return e || null;
};

export const getOrUpdate = async <T>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string,
  newValues: Record<string, any>,
  updateFn?: (entry?: T) => Omit<T, "save">
): Promise<T> => {
  let e: any = await store.get(entityConstructor, {
    where: { id },
  });
  const updatedItem = e
    ? updateFn
      ? updateFn(e)
      : { ...e, ...newValues, id }
    : updateFn
    ? updateFn()
    : { ...newValues, id };
  e = e || new entityConstructor({ id });
  for (const property in updatedItem) {
    e[property] = updatedItem[property];
  }

  await store.save(e);
  return e;
};

export function constructCache<T extends BlockExtrinisic| BlockEvent>(
  list : Array<T> 
  ):Map<string,  Array<T>>
  {
    let cache: Map<string,  Array<T>> = new Map()
    list.map((element: T ) => {
      let array = cache.get(`${element.blockNumber}`) || []
      array?.push(element)
      cache.set(`${element.blockNumber}`,array)
    })
    return cache
  }

  export function convertAddressToSubstrate(address: string) : string {
    return encodeAddress(address, 42);
}
