import { Store, SubstrateBlock } from "@subsquid/substrate-processor";
import { encodeAddress } from "@polkadot/util-crypto";
import * as ss58 from "@subsquid/ss58";

export const parseNumber = (hexOrNum: string | number | undefined): number => {
  if (!hexOrNum) {
    return 0;
  }
  return typeof hexOrNum === "string"
    ? parseInt(hexOrNum.replace(/^0x/, ""), 16) || 0
    : hexOrNum;
};

export const parseBigInt = (data: any) => {
  if (data !== undefined) {
    return JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? `${value}#bigint` : value
    ).replace(/"(-?\d+)#bigint"/g, (_, value) => value);
  }
  return 0;
};

export const toHex = (data: Uint8Array): string => {
  return `0x${Buffer.from(data).toString("hex")}`;
};

const kusamaCodec = ss58.codec("kusama");
export const toKusamaFormat = (data: Uint8Array): string => {
  return kusamaCodec.encode(data);
};

export const timestampToDate = (block: SubstrateBlock): Date => {
  return new Date(block.timestamp);
};

export type EntityConstructor<T> = {
  new (...args: any[]): T;
};

export const getOrCreate = async <T extends { id: string }>(
  store: Store,
  EntityConstructor: EntityConstructor<T>,
  id: string
): Promise<T> => {
  let entity = await store.get(EntityConstructor, {
    where: { id },
  });

  if (entity == null) {
    entity = new EntityConstructor();
    entity.id = id;
  }

  return entity as T;
};

export const get = async <T extends { id: string }>(
  store: Store,
  entityConstructor: EntityConstructor<T>,
  id: string,
  query?: any
): Promise<T | null> => {
  const entity = await store.get(entityConstructor, {
    where: !query ? { id } : query,
  });

  return entity || null;
};

export const getOrUpdate = async <T>(
  store: Store,
  EntityConstructor: EntityConstructor<T>,
  id: string,
  newValues: Record<string, any>,
  updateFn?: (entry?: T) => Omit<T, "save">
): Promise<T> => {
    let e: any = await store.get(EntityConstructor, {
        where: {id},
    });
    const updatedItem = e
        ? updateFn
            ? updateFn(e)
            : {...e, ...newValues, id}
        : updateFn
            ? updateFn()
            : {...newValues, id};
    e = e || new EntityConstructor({id});
    for (const property in updatedItem) {
        e[property] = updatedItem[property];
    }

    await store.save(e);
    return e;
};

export function convertAddressToSubstrate(address: string): string {
  return (address && encodeAddress(address, 42)) || "";
}
