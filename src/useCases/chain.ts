import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { findByCriteria, upsert } from "./common";
import { Chain } from "../model";
import { KUSAMA_CHAIN_DETAILS } from "../constants";
import { getKusamaToken } from "./token";

const chainCache: Map<string, Chain> = new Map();

// all system consider parachainId as a number.
export const getChain = async (store: Store, id: number): Promise<Chain> => {
  let chain = chainCache.get(`${id}`);
  if (!chain) {
    chain = await findByCriteria(store, Chain, {
      where: { id: `${id}` },
      relations: ["nativeToken"],
    });
  }
  if (!chain) {
    chain = await createKusamaChain(store);
  }
  chainCache.set(`${id}`, chain);

  return chain;
};

export const createOrUpdateChain = (
  store: Store,
  data: DeepPartial<Chain>
): Promise<Chain> => upsert(store, Chain, data);

export const getKusamaChain = (store: Store): Promise<Chain> =>
  getChain(store, +KUSAMA_CHAIN_DETAILS.id);

export const getKusamaChainId = (store: Store): Promise<string> =>
  getKusamaChain(store).then(({ id }) => id);

export const createKusamaChain = async (store: Store): Promise<Chain> => {
  return createOrUpdateChain(store, {
    id: KUSAMA_CHAIN_DETAILS.id,
    name: KUSAMA_CHAIN_DETAILS.chainName,
    relayChain: KUSAMA_CHAIN_DETAILS.relayChain,
    relayId: KUSAMA_CHAIN_DETAILS.relayId,
    nativeToken: await getKusamaToken(store),
    registeredAt: KUSAMA_CHAIN_DETAILS.registeredAt,
  });
};
