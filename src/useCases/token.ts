import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { Token } from "../model";
import { findById, upsert } from "./common";
import { KUSAMA_TOKEN_DETAILS } from "../constants";

const tokenCache: Map<string, Token> = new Map();

export const getToken = async (store: Store, id: string): Promise<Token> => {
  let token = tokenCache.get(id);

  if (!token) {
    token = await findById(store, Token, id);
  }
  if (!token) {
    token = await getKusamaToken(store);
  }

  tokenCache.set(id, token);

  return token;
};

const createOrUpdateToken = (store: Store, data: DeepPartial<Token>) =>
  upsert(store, Token, data);

export const getKusamaToken = (store: Store) =>
  getToken(store, KUSAMA_TOKEN_DETAILS.id);

export const createKusamaToken = (store: Store) => {
  return createOrUpdateToken(store, {
    id: KUSAMA_TOKEN_DETAILS.id,
    name: KUSAMA_TOKEN_DETAILS.tokenName,
  });
};
