import { DatabaseManager, EventContext, ExtrinsicInfo, StoreContext, SubstrateBlock, SubstrateEvent, SubstrateExtrinsic } from "@subsquid/hydra-common";
import { NATIVE_TOKEN_DETAILS, RELAY_CHAIN_DETAILS } from "../constants";
import { Account, Balance, Chains, Token, Transfers } from "../generated/model";
import { Balances } from "../types/Balances";
import { allBlockExtrinsics, apiService } from "./helpers/api";
import { get, getOrCreate, timestampToDate } from "./helpers/common";
import { logErrorToFile } from "./helpers/log";

// Please Note
// Account Address would be stored in substrate format

// The chain would default be the relay chain until 
// we add feature to support multi chains

let relayChain: any
let nativeToken: any

// Helpers for balances

/**
 * Caches Relay Chain details
 */
 export async function setRelayChain(
  store: DatabaseManager,
  relayChainDetails = RELAY_CHAIN_DETAILS
  ){
    let chain = await get(store,Chains,relayChainDetails.id) 
    if(!chain){
      console.log('Default chain not found, exiting')
      process.exit(0)
    }
    relayChain = chain
  }

/**
 * Caches native token details
 */
 export async function setTokenDetails(
  store: DatabaseManager,
  tokenDetails = NATIVE_TOKEN_DETAILS
  ){
    let token = await get(store,Token,tokenDetails.id) 
    if(!token){
      console.log('Default token not found, exiting')
      process.exit(0)
    }
    nativeToken = token
  }


/**
 * Construct balances Id
 * @param accountId 
 * @param tokenId 
 * @returns 
 */
export function getBalanceId(
  accountId: string,
  tokenId: string = RELAY_CHAIN_DETAILS.id
  ){
    return `${accountId}-${tokenId}`
  }


/**
 * Creates a new account
 * @param {string} accountId 
 * @param {DatabaseManager} store 
 * @returns {Account}
 */
export const createNewAccount =async (
  accountId:string,
  freeBalance : bigint,
  reserveBalance: bigint,
  timestamp: Date,
  store: DatabaseManager) => {
  if(relayChain == undefined){
    await setRelayChain(store)
  }
  if(nativeToken == undefined){
    await setTokenDetails(store)
  }


  const newAccount = new Account({
    id: accountId,
    chainId: relayChain
  })

  await store.save(newAccount)
  const balance = new Balance({
    accountId: newAccount,
    bondedBalance: reserveBalance,
    freeBalance: freeBalance,
    id: getBalanceId(accountId),
    timestamp: timestamp,
    tokenId: nativeToken,
    vestedBalance: 0n
  })
  await store.save(balance)
  return newAccount
}

 
export const newAccountHandler = async ({
  store,
  event,
  block,
  extrinsic
}: EventContext & StoreContext): Promise<void> => {
  const [to, balance] = new Balances.NewAccountEvent(event).params;
  let isTransfer:any
  if(extrinsic?.id){
    const allExtrinsic = await allBlockExtrinsics(block.height);
    const currentExtrinsic = allExtrinsic.find((extrinsicItem) => 
      extrinsicItem.id === extrinsic?.id)
    isTransfer = currentExtrinsic && currentExtrinsic.substrate_events.find(
      (eventItem) => eventItem.name === 'balances.transfer'
    )
  } 
  if(isTransfer){
    // A new account can be created by a transfer also. This will be handled in balance
    // transfers. Skipping
    console.log('Transfer Detected for new account.Skipping')
    return
  }

  await createNewAccount(to.toString(),balance.toBigInt(),0n, timestampToDate(block), store)
}


export const balanceTransfer = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [from,to, balance] = new Balances.TransferEvent(event).params;

  let [accountFrom, accountTo] = await Promise.all([
    get(store, Account,from.toString()),
    get(store, Account,to.toString()),
  ])
  
  if(accountFrom == undefined){
    console.error('Account not found ',from.toString())
    let api = await apiService()
    const hash = await api.rpc.chain.getBlockHash(9577);
    api = await api.at(hash)
    const [free,reserve] = await Promise.all([
      api.query.balances.freeBalance(from.toString()),
      api.query.balances.reservedBalance(from.toString()),
  ])
  accountFrom = await createNewAccount(from.toString(),BigInt(free), BigInt(reserve),timestampToDate(block), store)
  await logErrorToFile(`From Account ${from.toString()} not found at block ${block.height}`)
}
  if(accountTo == undefined){
    accountTo = await createNewAccount(to.toString(),0n,0n, timestampToDate(block), store)
  }
  
  let [balanceFrom, balanceTo] = await Promise.all([
    get(store, Balance,getBalanceId(from.toString())),
    get(store, Balance,getBalanceId(to.toString())),
  ])

if(
  balanceFrom == null || balanceTo == null
  ){
  console.error(`balances not found, `,from.toString(), to.toString())
  process.exit(0)
}
  balanceFrom.freeBalance = (balanceFrom?.freeBalance || 0n) - balance.toBigInt()
  balanceTo.freeBalance = (balanceTo?.freeBalance || 0n) + balance.toBigInt()

  await Promise.all([
    store.save(balanceFrom),
    store.save(balanceTo)
  ])

};
