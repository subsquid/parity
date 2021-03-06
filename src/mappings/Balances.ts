import {
  DatabaseManager,
  EventContext,
  StoreContext,
  SubstrateBlock,
  SubstrateExtrinsic,
} from "@subsquid/hydra-common";
import { NATIVE_TOKEN_DETAILS, RELAY_CHAIN_DETAILS } from "../constants";
import { Account, Balance, Chains, Token, Transfers } from "../generated/model";
import { Balances } from "../types/Balances";
import { apiService } from "./helpers/api";
import { get, timestampToDate } from "./helpers/common";
import { logErrorToFile } from "./helpers/log";

// Please Note
// Account Address would be stored in substrate format

// The chain would default be the relay chain until
// we add feature to support multi chains

let relayChain: any;
let nativeToken: any;

interface balanceRPCResponse {
  free: bigint;
  reserve: bigint;
}

type createAccountResponse = [Account, Balance | undefined];

// Helpers for balances
// TODO add handler for reserve repatriated

/**
 * Caches Relay Chain details
 */
export async function setAndGetRelayChain(
  store: DatabaseManager,
  relayChainDetails = RELAY_CHAIN_DETAILS
) {
  let chain = await get(store, Chains, relayChainDetails.id);
  if (!chain) {
    console.log("Default chain not found, exiting");
    process.exit(0);
  }
  relayChain = chain;
  return chain;
}

/**
 * Fetch balance from RPC
 * @param { SubstrateBlock} block
 * @param {string} accountId
 * @returns {Promise<balanceRPCResponse>}
 */
export async function getBalanceFromRPC(
  block: SubstrateBlock,
  accountId: string
): Promise<balanceRPCResponse> {
  // taking parent hash since balance could change in the represent block
  let api = await apiService(block.parentHash);
  if (api.query.balances.freeBalance && api.query.balances.reservedBalance) {
    const [free, reserve] = await api.queryMulti([
      [api.query.balances.freeBalance, accountId],
      [api.query.balances.reservedBalance, accountId],
    ]);
    return { free: free.toBigInt(), reserve: reserve.toBigInt() };
  }

  if (api.query.system.account) {
    const { data: balance } = await api.query.system.account(accountId);
    return {
      free: balance.free.toBigInt(),
      reserve: balance.reserved.toBigInt(),
    };
  }

  console.log("Error Fetching the balance ", accountId);
  process.exit(0);
}

/**
 * Caches native token details
 */
export async function setAndGetTokenDetails(
  store: DatabaseManager,
  tokenDetails = NATIVE_TOKEN_DETAILS
) {
  let token = await get(store, Token, tokenDetails.id);
  if (!token) {
    console.log("Default token not found, exiting");
    process.exit(0);
  }
  nativeToken = token;
  return token;
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
) {
  return `${accountId}-${tokenId}`;
}

/**
 * Retrieve balances
 * @param {string} from
 * @param {string} method
 * @param {DatabaseManager} store
 * @param {SubstrateBlock} block
 * @param {string} tokenId
 * @returns {Balance}
 */
export async function getBalance(
  from: string,
  method: string,
  store: DatabaseManager,
  block: SubstrateBlock,
  createIfNotFound: boolean = false,
  tokenId: string = RELAY_CHAIN_DETAILS.id
): Promise<Balance> {
  const balance = await get(
    store,
    Balance,
    getBalanceId(from.toString(), tokenId)
  );

  if (balance === undefined || balance === null) {
    let error = `Balance not found in ${method} ${from.toString()} when getting balance`;
    console.error(error);
    if (createIfNotFound) {
      logErrorToFile(error);
      const [, newBalance] = await createAccountIfNotPresent(
        from.toString(),
        store,
        block
      );
      if (!newBalance) {
        console.error("Error while fetching balance in getBalance");
        process.exit(1);
      }
      return newBalance;
    }
    process.exit(0);
  }
  return balance;
}

/**
 * Create account if not found
 * @param  address
 * @param store
 * @param block
 * @returns {Promise<createAccountResponse>}
 */
export const createAccountIfNotPresent = async (
  address: string,
  store: DatabaseManager,
  block: SubstrateBlock
): Promise<createAccountResponse> => {
  let account = await get(store, Account, address);
  let balance: Balance | undefined;
  if (account == undefined || account == null) {
    const balanceRPC = await getBalanceFromRPC(block, address);
    [account, balance] = await createNewAccount(
      address,
      balanceRPC.free,
      balanceRPC.reserve,
      timestampToDate(block),
      store
    );

    if (!balance) {
      console.error("Error fetching balance in create account if not present");
      process.exit(1);
    }
  }
  return [account, balance];
};
/**
 * Creates a new account
 * @param {string} accountId
 * @param {DatabaseManager} store
 * @returns {createAccountResponse]}
 */
export const createNewAccount = async (
  accountId: string,
  freeBalance: bigint,
  reserveBalance: bigint,
  timestamp: Date,
  store: DatabaseManager
): Promise<createAccountResponse> => {
  if (relayChain == undefined) {
    await setAndGetRelayChain(store);
  }
  if (nativeToken == undefined) {
    await setAndGetTokenDetails(store);
  }

  const newAccount = new Account({
    id: accountId,
    chainId: relayChain,
  });

  await store.save(newAccount);
  const balance = new Balance({
    accountId: newAccount,
    bondedBalance: reserveBalance,
    freeBalance: freeBalance,
    id: getBalanceId(accountId),
    timestamp: timestamp,
    tokenId: nativeToken,
    vestedBalance: 0n,
  });
  await store.save(balance);
  return [newAccount, balance];
};

/**
 * Handles transfer of balance
 * @param {string} from
 * @param {string} to
 * @param {bigint} amount
 * @param {SubstrateExtrinsic} extrinsic
 * @param {DatabaseManager} store
 * @param {SubstrateBlock} block
 * @returns { Promise<[Account, Account]>}
 */
export async function accountBalanceTransfer(
  from: string,
  to: string,
  amount: bigint,
  fromReserve: boolean,
  toReserve: boolean,
  extrinsic: SubstrateExtrinsic | undefined,
  store: DatabaseManager,
  block: SubstrateBlock
): Promise<[Account, Account]> {
  let [accountFrom, accountTo] = await Promise.all([
    get(store, Account, from.toString()),
    get(store, Account, to.toString()),
  ]);

  if (accountFrom == undefined) {
    console.error("Account not found ", from.toString());
    [accountFrom] = await createAccountIfNotPresent(from, store, block);
    await logErrorToFile(
      `From Account ${from.toString()} not found at block ${block.height}`
    );
  }
  if (accountTo == undefined) {
    [accountTo] = await createAccountIfNotPresent(to.toString(), store, block);
  }

  let [balanceFrom, balanceTo] = await Promise.all([
    get(store, Balance, getBalanceId(from.toString())),
    get(store, Balance, getBalanceId(to.toString())),
  ]);

  if (balanceFrom == null || balanceTo == null) {
    console.error(`balances not found, `, from.toString(), to.toString());
    process.exit(0);
  }
  if (!fromReserve) {
    balanceFrom.freeBalance = (balanceFrom?.freeBalance || 0n) - amount;
  } else {
    balanceFrom.bondedBalance = (balanceFrom?.bondedBalance || 0n) - amount;
  }

  let newAccountEvent = cacheNewAccountEvents[block.height]?.[to.toString()];

  // Skip balance to if already done in new account creation
  let skipToBalanceProcess =
    newAccountEvent?.extrinsicId === extrinsic?.id &&
    newAccountEvent?.amount === amount;

  if (!toReserve) {
    balanceTo.freeBalance = skipToBalanceProcess
      ? balanceTo.freeBalance
      : (balanceTo?.freeBalance || 0n) + amount;
  } else {
    balanceTo.bondedBalance = (balanceTo?.bondedBalance || 0n) + amount;
  }

  await Promise.all([store.save(balanceFrom), store.save(balanceTo)]);
  return [accountFrom, accountTo];
}

interface newAccountCache {
  [blockNumber: number]: {
    [address: string]: {
      extrinsicId: string | undefined;
      amount: bigint;
    };
  };
}
const cacheNewAccountEvents: newAccountCache = {};

export const newAccountHandler = async ({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> => {
  const [to, balance] = new Balances.NewAccountEvent(event).params;
  const blockNumber = block.height;

  // Clear cache for a new block
  cacheNewAccountEvents[blockNumber] = cacheNewAccountEvents[blockNumber]
    ? cacheNewAccountEvents[blockNumber]
    : {};

  // Since a transfer can also cause a new account event
  // we are caching such events to avoid adding new balance again
  cacheNewAccountEvents[blockNumber][to.toString()] =
    cacheNewAccountEvents[blockNumber][to.toString()] || {};
  cacheNewAccountEvents[blockNumber][to.toString()] = {
    extrinsicId: extrinsic?.id,
    amount: balance.toBigInt(),
  };

  await createNewAccount(
    to.toString(),
    balance.toBigInt(),
    0n,
    timestampToDate(block),
    store
  );
};
export const newBalanceSetHandler = async ({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> => {
  const [to, balance] = new Balances.BalanceSetEvent(event).params;
  const blockNumber = block.height;

  const newAccountEvent = cacheNewAccountEvents[blockNumber]?.[to.toString()];

  if (newAccountEvent?.extrinsicId === extrinsic?.id) {
    // already processed in new account, skipping
    return;
  }

  const balanceTo = await getBalance(
    to.toString(),
    "Balance Set Event",
    store,
    block
  );

  balanceTo.freeBalance = (balanceTo.freeBalance || 0n) + balance.toBigInt();
  await store.save(balanceTo);
};

export const balanceReserveRepatriated = async ({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> => {
  const [from, to, amount] = new Balances.ReserveRepatriatedEvent(event).params;
  const transferToType = event.params[3].value === "Reserved";
  await accountBalanceTransfer(
    from.toString(),
    to.toString(),
    amount.toBigInt(),
    true,
    transferToType,
    extrinsic,
    store,
    block
  );
};

export const balanceTransfer = async ({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> => {
  const [from, to, amount] = new Balances.TransferEvent(event).params;

  let [accountFrom, accountTo] = await accountBalanceTransfer(
    from.toString(),
    to.toString(),
    amount.toBigInt(),
    false,
    false,
    extrinsic,
    store,
    block
  );

  if (nativeToken == undefined) {
    await setAndGetTokenDetails(store);
  }

  const transfer = new Transfers({
    senderAccount: accountFrom,
    receiverAccount: accountTo,
    tokenId: nativeToken, // will have to change once fix is up
    amount: amount.toBigInt(),
    timestamp: timestampToDate(block),
  });

  await store.save(transfer);
};

export const balanceDestroy = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [from] = new Balances.DustLostEvent(event).params;
  const balance = await getBalance(
    from.toString(),
    "Balances DustLost",
    store,
    block,
    true
  );

  balance.bondedBalance = 0n;
  balance.vestedBalance = 0n;
  balance.freeBalance = 0n;

  await store.save(balance);
};

export const balancesReserved = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [from, amount] = new Balances.ReservedEvent(event).params;
  const balance = await getBalance(
    from.toString(),
    "Balances Reserved",
    store,
    block,
    true
  );

  balance.bondedBalance = (balance.bondedBalance || 0n) + amount.toBigInt();
  balance.freeBalance = (balance.freeBalance || 0n) - amount.toBigInt();

  await store.save(balance);
};

export const balancesUnReserved = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [from, amount] = new Balances.ReservedEvent(event).params;
  const balance = await getBalance(
    from.toString(),
    "Balances UnReserved",
    store,
    block,
    true
  );

  balance.bondedBalance = (balance.bondedBalance || 0n) - amount.toBigInt();
  balance.freeBalance = (balance.freeBalance || 0n) + amount.toBigInt();

  await store.save(balance);
};

export const balancesDeposit = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [from, amount] = new Balances.DepositEvent(event).params;
  const balance = await getBalance(
    from.toString(),
    "Balances Deposit",
    store,
    block,
    true
  );

  balance.freeBalance = (balance.freeBalance || 0n) + amount.toBigInt();

  await store.save(balance);
};

export const balancesWithdraw = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [from, amount] = new Balances.WithdrawEvent(event).params;
  const balance = await getBalance(
    from.toString(),
    "Balances withdraw",
    store,
    block,
    true
  );

  balance.freeBalance = (balance.freeBalance || 0n) - amount.toBigInt();

  await store.save(balance);
};

export const balancesSlashed = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [from, amount] = new Balances.SlashedEvent(event).params;
  const balance = await getBalance(
    from.toString(),
    "Balances Slashed",
    store,
    block,
    true
  );

  balance.freeBalance = (balance.freeBalance || 0n) - amount.toBigInt();

  await store.save(balance);
};
