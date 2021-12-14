import { Bool } from "@polkadot/types";
import { Extrinsics } from "@polkadot/types/metadata/decorate/types";
import { DatabaseManager, EventContext, ExtrinsicInfo, StoreContext, SubstrateBlock, SubstrateEvent, SubstrateExtrinsic } from "@subsquid/hydra-common";
import { NATIVE_TOKEN_DETAILS, RELAY_CHAIN_DETAILS } from "../constants";
import { Account, Balance, Chains, Token, Transfers } from "../generated/model";
import { Balances } from "../types/Balances";
import { get, getOrCreate, timestampToDate } from "./helpers/common";

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
  block: SubstrateBlock,
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
    bondedBalance: 0n,
    freeBalance: freeBalance,
    id: getBalanceId(accountId),
    timestamp: timestampToDate(block),
    tokenId: nativeToken,
    vestedBalance: 0n
  })
  await store.save(balance)
  return newAccount
}

// async function populateTransfer(
//   event: SubstrateEvent,
//   block: SubstrateBlock,
//   extrinsic: SubstrateExtrinsic | undefined,
//   store: DatabaseManager
// ): Promise<void> {

//   const transfer = new Transfers()
//   element.timestamp = timestampToDate(block);
//   element.blockNumber = blockNumber(event);
//   if (extrinsic !== undefined && extrinsic !== null) {
//     element.extrinsicHash = extrinsic.hash;
//     element.extrinsicIdx = extrinsic.id;
//   }
//   const [from, to, value] = new Balances.TransferEvent(event).params
//   const fees = await feeEventsToExtrinisicMap(block.height);
//   let transfer: Transfer | undefined = await store.get(Transfer, {
//     where: { extrinisicIdx: extrinsic?.id },
//   })
//   if (transfer == null) {
//     transfer = new Transfer()
//   }

//   if (extrinsic?.id == undefined) {
//     console.error(`extrinisic id undefined for transfer with event id = ${event.id}.Skipping it `)
//     return
//   }
//   transfer.amount = value.toString();
//   transfer.from = convertAddress(from.toString());
//   transfer.to =  convertAddress(to.toString())
//   transfer.fee = calculateFee(extrinsic as BlockExtrinisic,fees);
//   transfer.extrinisicIdx = extrinsic?.id;
//   transfer.eventIdx = event.id;
//   transfer.success = true;
//   transfer.id = event.id
//   transfer.isTransferKeepAlive = extrinsic.method === 'transferKeepAlive'
//   await store.save(transfer);

//   element.item = new TransferItem({
//     transfer: transfer.id
//   })
//   await store.save(element);
// }
 
export const newAccountHandler = async ({
  store,
  event,
  block,
  extrinsic
}: EventContext & StoreContext): Promise<void> => {
  const [to, balance] = new Balances.NewAccountEvent(event).params;
  let isTransfer: Boolean = false
  if(extrinsic?.id){
    isTransfer = extrinsic.method === 'transfer' && extrinsic.section === 'balances'
  } 
  if(isTransfer){
    // A new account can be created by a transfer also. This will be handled in balance
    // transfers. Skipping
    console.log('Transfer Detected for new account.Skipping')
    return
  }

  await createNewAccount(to.toString(),balance.toBigInt(), block, store)
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
    process.exit(0)
  }
  if(accountTo == undefined){
    accountTo = await createNewAccount(to.toString(),0n, block, store)
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
