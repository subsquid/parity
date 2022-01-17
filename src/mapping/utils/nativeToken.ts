import { Store } from "@subsquid/substrate-processor";
import { NATIVE_TOKEN_DETAILS } from "../../constants";
import { get } from "./utils";
import { Token } from "../../model";

export class NativeToken {
  private static _token: Token;

  public static get token(): Token {
    return this._token;
  }

  /**
   * Caches native token details
   */
  public static async setAndGetTokenDetails(
    store: Store,
    tokenDetails = NATIVE_TOKEN_DETAILS
  ): Promise<Token> {
    const token = await get(store, Token, tokenDetails.id);
    if (!token) {
      console.log("Default token not found, exiting");
      process.exit(0);
    }

    this._token = token;

    return this._token;
  }
}
