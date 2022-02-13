import { Store } from "@subsquid/substrate-processor";
import { createOrUpdateDbCache, getDbCache } from "../useCases/dbCache";
import { DbCache } from "../model";

export class DbCacheAccessor<T> {
  /** customKey - for optimization's sake, permanentKey allows omitting heavy dynamicKey calculation */
  constructor(
    private readonly store: Store,
    public readonly customKey?: string
  ) {}

  public setValue = async (
    dynamicKey: string,
    value: T,
    readCounter: number
  ): Promise<void> => {
    await createOrUpdateDbCache<T>(this.store, {
      id: this.customKey ?? dynamicKey,
      value,
      readCounter,
    });
  };

  public getValue = async (
    dynamicKey: string
  ): Promise<DbCache<T> | undefined> => {
    return getDbCache<T>(this.store, this.customKey ?? dynamicKey);
  };
}
