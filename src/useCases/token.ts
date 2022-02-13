import { Store } from "@subsquid/substrate-processor";
import { Token } from "../model";
import { findById, insertAndReturn } from "./common";
import { KUSAMA_TOKEN_DETAILS } from "../constants";

const tokenCache: Map<string, Token | undefined> = new Map();

const getToken = async (
  store: Store,
  id: string
): Promise<Token | undefined> => {
  let token = tokenCache.get(id);

  if (!token) {
    token = await findById(store, Token, id);
  }

  tokenCache.set(id, token);

  return token;
};

export const getOrCreateKusamaToken = async (store: Store): Promise<Token> => {
  let kusamaToken = await getToken(store, KUSAMA_TOKEN_DETAILS.id);
  if (!kusamaToken) {
    kusamaToken = await createKusamaToken(store);
  }
  tokenCache.set(KUSAMA_TOKEN_DETAILS.id, kusamaToken);
  return kusamaToken;
};

const createToken = (store: Store, data: Token) =>
  insertAndReturn(store, Token, data);

export const createKusamaToken = (store: Store): Promise<Token> => {
  return createToken(store, {
    id: KUSAMA_TOKEN_DETAILS.id,
    name: KUSAMA_TOKEN_DETAILS.tokenName,
  });
};
