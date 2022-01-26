import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { Account, Chain } from "../model";
import { findById, upsert } from "./common";
import {
  convertAddressToKusama,
  convertAddressToSubstrate,
} from "../utils/addressConvertor";
import { getKusamaChain } from "./chain";

export const getAccount = (store: Store, id: string) =>
  findById(store, Account, id);

export const createOrUpdateAccount = (
  store: Store,
  data: DeepPartial<Account>
) => upsert(store, Account, data);

export const createOrUpdateKusamaAccount = async (
  store: Store,
  kusamaAccountAddress: string,
  chain?: Chain
): Promise<Account> => {
  const accountChain = chain || (await getKusamaChain(store));

  return createOrUpdateAccount(store, {
    // to make sure it is really Kusama Address
    id: convertAddressToKusama(kusamaAccountAddress),
    chain: accountChain,
    // todo; check if substrate account is really in substrate format
    substrateAccount: convertAddressToSubstrate(kusamaAccountAddress),
  });
};
