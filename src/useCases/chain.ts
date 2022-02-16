import { Store, SubstrateBlock } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import {
  findByCriteria,
  insert,
  insertAndReturn,
  update,
  upsert,
} from "./common";
import { Chain } from "../model";
import { KUSAMA_CHAIN_DETAILS } from "../constants";
import { getOrCreateKusamaToken } from "./token";
import { getChainName, timestampToDate } from "../utils/common";

const chainCache: Map<string, Chain> = new Map();

export const getChain = async (
  store: Store,
  id: number
): Promise<Chain | undefined> => {
  let chain = chainCache.get(`${id}`);
  if (!chain) {
    chain = await findByCriteria(store, Chain, {
      where: { id: `${id}` },
      relations: ["nativeToken"],
    });
  }
  if (chain) {
    chainCache.set(`${id}`, chain);
  }
  return chain;
};

const createOrUpdateChain = (
  store: Store,
  data: DeepPartial<Chain>
): Promise<Chain> => upsert(store, Chain, data);

export function createChain(
  store: Store,
  data: Chain,
  shouldReturn: true
): Promise<Chain>;
export function createChain(store: Store, data: Chain): Promise<void>;
export function createChain(
  store: Store,
  data: Chain,
  shouldReturn?: boolean
): Promise<Chain | void> {
  return (shouldReturn ? insertAndReturn : insert)(store, Chain, data);
}

export const updateChainById = (
  store: Store,
  id: string,
  data: Partial<Chain>
): Promise<void> => update(store, Chain, { id }, data);

export const getOrCreateKusamaChain = async (store: Store): Promise<Chain> => {
  let kusamaChain = await getChain(store, +KUSAMA_CHAIN_DETAILS.id);
  if (!kusamaChain) {
    kusamaChain = await createKusamaChain(store);
  }

  chainCache.set(KUSAMA_CHAIN_DETAILS.id, kusamaChain);

  return kusamaChain;
};

export const getKusamaChainId = (store: Store): Promise<string> =>
  getOrCreateKusamaChain(store).then(({ id }) => id);

export const createKusamaChain = async (store: Store): Promise<Chain> => {
  return createChain(
    store,
    {
      id: KUSAMA_CHAIN_DETAILS.id,
      name: KUSAMA_CHAIN_DETAILS.chainName,
      relayChain: KUSAMA_CHAIN_DETAILS.relayChain,
      relayId: KUSAMA_CHAIN_DETAILS.relayId,
      nativeToken: await getOrCreateKusamaToken(store),
      registeredAt: KUSAMA_CHAIN_DETAILS.registeredAt,
      deregisteredAt: null,
      crowdloans: [],
    },
    true
  );
};

export const createOrUpdateParachain = async (
  store: Store,
  chainId: number,
  block: SubstrateBlock
): Promise<Chain> => {
  const chain = await getChain(store, chainId);

  return createOrUpdateChain(store, {
    id: `${chainId}`,
    nativeToken: chain?.nativeToken ?? (await getOrCreateKusamaToken(store)),
    name: chain?.name || getChainName(chainId),
    relayId:
      chain?.relayId ??
      (await getOrCreateKusamaChain(store).then(({ id }) => id)),
    relayChain: false,
    ...(chain ? {} : { registeredAt: timestampToDate(block) }),
    deregisteredAt: null,
  });
};
