import { DatabaseManager, EventContext, StoreContext, SubstrateBlock } from '@subsquid/hydra-common'
import { Account, Balance, Chain, Token, Transfer } from '../generated/model'
import { Balances } from '../types'
import { getOrCreate, timestampToDate } from "./helpers/common"
import { constChainDetails, constTokenDetails } from "./helpers/consistenecy";


export const handleTransfer = async ({
    store,
    event,
    block,
    extrinsic,
}: EventContext & StoreContext): Promise<void> => {

    const [from, to, value] = new Balances.TransferEvent(event).params;

    let transfer = await store.get(Transfer, {
        where: { id: block.height.toString() }
    });

    if (!transfer) {
        await handleAccountAndBalance(store, block, from.toHex(), value.toBigInt(), true)
        await handleAccountAndBalance(store, block, to.toHex(), value.toBigInt(), false)

        // token data check and creation
        let tokenData: Token | undefined = await store.get(Token, {
            where: { id: constTokenDetails.id }  // This is temporary until we got way to get the chain id and token id
        });

        if (!tokenData) {
            tokenData = new Token(constTokenDetails);
            await store.save(tokenData);
        }

        // account data creation and saving

        transfer = new Transfer({
            id: block.height.toString(),
            senderAccount: from.toString(),
            reveiverAccount: to.toString(),
            tokenId: tokenData.id,
            amount: value.toBigInt(),
            timestamp: timestampToDate(block)
        });

        await store.save(transfer);
    }

}


const handleAccountAndBalance = async (
    store: DatabaseManager,
    block: SubstrateBlock,
    who: string,
    value: bigint,
    isFrom: boolean
) => {
    let balance = await store.get(Balance, {
        where: { accountId: who }
    });

    let balanceValue: bigint = balance?.freeBalance || 0n;
    balanceValue = isFrom ? balanceValue - value : balanceValue + value;

    if (!balance) {
        let account = await store.get(Account, {
            where: { id: who }
        });

        // token data check and creation
        let tokenData: Token | undefined = await store.get(Token, {
            where: { id: constTokenDetails.id }  // This is temporary until we got way to get the chain id and token id
        });

        if (!tokenData) {
            tokenData = new Token(constTokenDetails);
            await store.save(tokenData);
        }

         // chain data check and creation
         const chainID = `${block.height}-${who}` || constChainDetails.id
         let chainData: Chain | undefined = await store.get(Chain, {
             where: { id: chainID }   // This is temporary until we got way to get the chain id and token id
         });
 
 
         if (!chainData) {
             constChainDetails.id = chainID;
             chainData = new Chain(constChainDetails);
             await store.save(chainData);
         }

        // account data check and creation
        if (!account) {
            account = new Account({
                id: who,
                chainId: tokenData.id,
                balance: balanceValue
            })
        } else {
            account.balance = balanceValue
        }

        await store.save(account);

        // account data saving
        balance = new Balance({
            id: block.height.toString(),
            accountId: account.id,
            tokenId: tokenData.id,
            timestamp: timestampToDate(block),
            freeBalance: 0n,
            bondedBalance: balanceValue
        });

        await store.save(balance);
    } else {
        balance.bondedBalance = balanceValue
        await store.save(balance);
    }
}