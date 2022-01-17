import { ApiPromise } from "@polkadot/api";
import {
  Store,
  SubstrateBlock,
  SubstrateExtrinsic,
} from "@subsquid/substrate-processor";
import type { Codec } from "@polkadot/types-codec/types";
import { apiService } from "./api";
import { CrowdloanReturn, ParachainReturn } from "./types";
import {
  convertAddressToSubstrate,
  get,
  getOrUpdate,
  parseBigInt,
  parseNumber,
  timestampToDate,
} from "./utils";
import { CrowdloanStatus, RELAY_CHAIN_DETAILS } from "../../constants";
import {
  Account,
  Balance,
  Chains,
  Crowdloan,
  CrowdloanSequence,
} from "../../model";
import { logErrorToFile } from "./log";
import { NativeToken } from "./nativeToken";
import { cacheNewAccountEvents } from "./cacheNewAccountEvents";
import { RelayChain } from "./relayChain";

/**
 * Construct balances Id
 * @param accountId
 * @param tokenId
 * @returns
 */
function getBalanceId(
  accountId: string,
  tokenId: string = RELAY_CHAIN_DETAILS.id
) {
  return `${accountId}-${tokenId}`;
}

interface BalanceRPCResponse {
  free: bigint;
  reserve: bigint;
}

type CreateAccountResponse = [Account, Balance | undefined];

/**
 * Fetch balance from RPC
 * @param { SubstrateBlock} block
 * @param {string} accountId
 * @returns {Promise<BalanceRPCResponse>}
 */
async function getBalanceFromRPC(
  block: SubstrateBlock,
  accountId: string
): Promise<BalanceRPCResponse> {
  // taking parent hash since balance could change in the represent block
  const api = await apiService(block.parentHash);
  if (api.query.balances.freeBalance && api.query.balances.reservedBalance) {
    const [free, reserve] = (await api.queryMulti([
      [api.query.balances.freeBalance, accountId],
      [api.query.balances.reservedBalance, accountId],
    ])) as [Codec, Codec];
    // @ts-ignore
    return { free: free.toBigInt(), reserve: reserve.toBigInt() };
  }

  if (!api.query.system.account) {
    console.log("Error Fetching the balance ", accountId);
    process.exit(0);
  }

  // todo; fix it!
  // @ts-ignore
  const { data: balance } = await api.query.system.account(accountId);
  return {
    free: balance.free.toBigInt(),
    reserve: balance.reserved.toBigInt(),
  };
}

/**
 * Creates a new account
 * @param {string} accountId
 * @param freeBalance
 * @param reserveBalance
 * @param timestamp
 * @param {Store} store
 * @returns {createAccountResponse]}
 */
export const createNewAccount = async (
  accountId: string,
  freeBalance: bigint,
  reserveBalance: bigint,
  timestamp: Date,
  store: Store
): Promise<CreateAccountResponse> => {
  if (!RelayChain.chain) {
    await RelayChain.setAndGetRelayChain(store);
  }
  if (!NativeToken.token) {
    await NativeToken.setAndGetTokenDetails(store);
  }

  const newAccount = new Account({
    id: accountId,
    chainId: RelayChain.chain,
  });

  await store.save(newAccount);
  const balance = new Balance({
    accountId: newAccount,
    bondedBalance: reserveBalance,
    freeBalance,
    id: getBalanceId(accountId),
    timestamp,
    tokenId: NativeToken.token,
    vestedBalance: 0n,
  });
  await store.save(balance);
  return [newAccount, balance];
};

/**
 * Create account if not found
 * @param  address
 * @param store
 * @param block
 * @returns {Promise<CreateAccountResponse>}
 */
export const createAccountIfNotPresent = async (
  address: string,
  store: Store,
  block: SubstrateBlock
): Promise<CreateAccountResponse> => {
  let account = await get(store, Account, address);
  let balance: Balance | undefined;
  if (!account) {
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
 * Handles transfer of balance
 * @param {string} from
 * @param {string} to
 * @param {bigint} amount
 * @param {boolean} fromReserve
 * @param {boolean} toReserve
 * @param {SubstrateExtrinsic} extrinsic
 * @param {Store} store
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
  store: Store,
  block: SubstrateBlock
): Promise<[Account, Account]> {
  let [accountFrom, accountTo] = await Promise.all([
    get(store, Account, from.toString()),
    get(store, Account, to.toString()),
  ]);

  if (!accountFrom) {
    console.error("Account not found ", from.toString());
    [accountFrom] = await createAccountIfNotPresent(from, store, block);
    logErrorToFile(`From Account ${from} not found at block ${block.height}`);
  }
  if (!accountTo) {
    [accountTo] = await createAccountIfNotPresent(to, store, block);
  }

  const [balanceFrom, balanceTo] = await Promise.all([
    get(store, Balance, getBalanceId(from.toString())),
    get(store, Balance, getBalanceId(to.toString())),
  ]);

  if (!balanceFrom || !balanceTo) {
    console.error(`balances not found, `, from, to.toString());
    process.exit(0);
  }
  if (!fromReserve) {
    balanceFrom.freeBalance = (balanceFrom?.freeBalance || 0n) - amount;
  } else {
    balanceFrom.bondedBalance = (balanceFrom?.bondedBalance || 0n) - amount;
  }

  const newAccountEvent = cacheNewAccountEvents[block.height]?.[to];

  // Skip balanceTo if already done in new account creation
  const skipToBalanceProcess =
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

/**
 * @shalabh add description
 * @param address
 * @returns
 */
export const isFundAddress = async (address: string) => {
  const api = (await apiService()) as ApiPromise;
  const hexStr = api.createType("Address", address).toHex();
  return Buffer.from(hexStr.slice(4, 28), "hex")
    .toString()
    .startsWith("modlpy/cfund");
};

export const fetchParachain = async (
  paraId: number,
  block: SubstrateBlock
): Promise<ParachainReturn | null> => {
  const api = await apiService(block.hash);
  const parachain = (
    await api.query.registrar.paras(paraId)
  ).toJSON() as unknown;

  return parachain as ParachainReturn | null;
};

/**
 * Retrieve balances
 * @param {string} from
 * @param {string} method
 * @param {Store} store
 * @param {SubstrateBlock} block
 * @param createIfNotFound
 * @param {string} tokenId
 * @returns {Balance}
 */
export async function getBalance(
  from: string,
  method: string,
  store: Store,
  block: SubstrateBlock,
  createIfNotFound = false,
  tokenId: string = RELAY_CHAIN_DETAILS.id
): Promise<Balance> {
  const balance = await get(store, Balance, getBalanceId(from, tokenId));

  if (balance === undefined || balance === null) {
    const error = `Balance not found in ${method} ${from} when getting balance`;
    console.error(error);
    if (createIfNotFound) {
      logErrorToFile(error);
      const [, newBalance] = await createAccountIfNotPresent(
        from,
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

export const ensureParachain = async (
  paraId: number,
  store: Store,
  block: SubstrateBlock
): Promise<Chains> => {
  const { manager, deposit } = (await fetchParachain(paraId, block)) || {
    manager: "",
    deposit: "",
  };
  const address = convertAddressToSubstrate(manager);
  const managerAccount = await createAccountIfNotPresent(address, store, block);
  const parachainId = `${paraId}-${address}`;
  await RelayChain.setAndGetRelayChain(store);
  return getOrUpdate<Chains>(store, Chains, parachainId, {
    id: parachainId,
    paraId,
    creationBlock: block.height,
    manager: managerAccount,
    relayId: RELAY_CHAIN_DETAILS.relayId,
    relayChain: false,
    deposit,
    deregistered: false,
  });
};

const getIsReCreateCrowdloan = async (
  fundId: string,
  store: Store
): Promise<boolean> => {
  const [fund] = await store.find(Crowdloan, {
    where: { id: fundId },
  });
  return !!(
    fund?.dissolvedBlock &&
    fund?.status === CrowdloanStatus.DISSOLVED &&
    fund?.isFinished
  );
};

export const getLatestCrowdloanId = async (
  parachainId: string,
  store: Store,
  block: SubstrateBlock
) => {
  const api = await apiService(block.hash);
  const [seq] = await store.find(CrowdloanSequence, {
    where: { id: parachainId },
  });
  const curBlockNum: Codec = await api.query.system.number();
  if (seq) {
    const crowdloanIdx = seq.curIndex;
    const isReCreateCrowdloan = await getIsReCreateCrowdloan(
      `${parachainId}-${crowdloanIdx}`,
      store
    );
    let curIdex = crowdloanIdx;
    if (isReCreateCrowdloan) {
      curIdex = crowdloanIdx + 1;
      seq.curIndex = curIdex;
      // todo; fix it!
      // @ts-ignore
      seq.blockNum = curBlockNum.toNumber();
      await store.save(seq);
    }

    return `${parachainId}-${curIdex}`;
  }

  const crowdloan = new CrowdloanSequence({
    id: parachainId,
    curIndex: 0,
    createdAt: new Date(),
    // todo; fix it!
    // @ts-ignore
    blockNum: curBlockNum.toNumber(),
  });
  await store.save(crowdloan);
  return `${parachainId}-0`;
};

const getParachainId = async (
  paraId: number | ParachainReturn,
  block: SubstrateBlock
) => {
  if (typeof paraId === "number") {
    let { manager } = (await fetchParachain(paraId, block)) || {};
    manager = convertAddressToSubstrate(manager || "");
    return `${paraId}-${manager || ""}`;
  }
  const { manager } = paraId || {};
  return `${paraId}-${manager || ""}`;
};

const fetchCrowdloan = async (
  paraId: number,
  block: SubstrateBlock
): Promise<CrowdloanReturn | null> => {
  const api = await apiService(block.hash);
  // Data may get pruned, so need to specify block hash
  const fund = await api.query.crowdloan.funds(paraId);

  return fund.toJSON() as unknown as CrowdloanReturn | null;
};

export const ensureFund = async (
  paraId: number,
  store: Store,
  block: SubstrateBlock,
  modifier?: Record<string, any>
): Promise<Crowdloan> => {
  const fund = await fetchCrowdloan(paraId, block);
  const parachainId = await getParachainId(paraId, block);
  const parachain = await store.find(Chains, {
    where: { id: parachainId },
    take: 1,
  });

  const fundId = await getLatestCrowdloanId(parachainId, store, block);
  const {
    cap,
    end,
    trieIndex,
    raised,
    lastContribution,
    firstPeriod,
    lastPeriod,
    ...rest
  } = fund || ({} as CrowdloanReturn);

  // TODO: Check this out, it should be an account but coming as string
  const despositor = rest.depositor;
  const { verifier } = rest;
  [rest.depositor] = await createAccountIfNotPresent(
    // @ts-ignore
    convertAddressToSubstrate(despositor),
    store,
    block
  );
  [rest.verifier] =
    rest.verifier == null
      ? [null]
      : await createAccountIfNotPresent(
        // @ts-ignore
        convertAddressToSubstrate(verifier?.sr25519),
          store,
          block
        );
  // TODO: Change after we integrate multiple tokens
  const token = await NativeToken.setAndGetTokenDetails(store);
  return getOrUpdate<Crowdloan>(store, Crowdloan, fundId, {}, (cur) => {
    return !cur
      ? new Crowdloan({
          id: fundId,
          paraId,
          tokenId: token,
          parachain: parachain[0],
          ...rest,
          firstSlot: firstPeriod,
          lastSlot: lastPeriod,
          status: CrowdloanStatus.STARTED,
          raised: parseNumber(raised) as unknown as bigint,
          cap: parseNumber(cap) as unknown as bigint,
          lockExpiredBlock: end,
          isFinished: false,
          ...modifier,
        })
      : new Crowdloan({
          ...cur,
          raised:
            raised === undefined
              ? (parseBigInt(cur.raised) as unknown as bigint)
              : (parseNumber(raised) as unknown as bigint),
          cap:
            cap === undefined
              ? (parseBigInt(cur.cap) as unknown as bigint)
              : (parseNumber(cap) as unknown as bigint),
          ...modifier,
        });
  });
};
