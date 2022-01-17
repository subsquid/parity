import { Store } from "@subsquid/substrate-processor";
import { Chains } from "../../model";
import { RELAY_CHAIN_DETAILS } from "../../constants";
import { get } from "./utils";

export class RelayChain {
  private static _chain: Chains;

  public static get chain(): Chains {
    return this._chain;
  }

  /**
   * Caches Relay Chain details
   */
  public static async setAndGetRelayChain(
    store: Store,
    relayChainDetails = RELAY_CHAIN_DETAILS
  ): Promise<Chains> {
    const chain = await get(store, Chains, relayChainDetails.id);
    if (!chain) {
      console.log("Default chain not found, exiting");
      process.exit(0);
    }

    this._chain = chain;

    return this._chain;
  }
}
