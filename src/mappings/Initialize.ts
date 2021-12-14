import { EventContext, StoreContext } from "@subsquid/hydra-common";
import { NATIVE_TOKEN_DETAILS, RELAY_CHAIN_DETAILS } from "../constants";
import { Chains, Token } from "../generated/model";

// Temporary work around till we see a solution
// to work with different chains

export const initializeConstantsHandler = async ({
      store,
      event,
      block,
    }: EventContext & StoreContext): Promise<void> => {
        if(block.height > 10000){
            return
        }
        console.log('Initializing Indexer with defaults')

        const nativeToken = new Token({
            id: NATIVE_TOKEN_DETAILS.id,
            tokenName: NATIVE_TOKEN_DETAILS.tokenName,
            tokenSymbol: NATIVE_TOKEN_DETAILS.tokenSymbol
        })

        await store.save(nativeToken)

        const relayChain = new Chains({
            id: RELAY_CHAIN_DETAILS.id,
            nativeToken: nativeToken,
            chainName: RELAY_CHAIN_DETAILS.chainName,
            relayId: RELAY_CHAIN_DETAILS.id,
            relayChain: RELAY_CHAIN_DETAILS.relayChain
        })

        await store.save(relayChain)
        console.log('Initializing Indexer with defaults completed')
    };
    