import { Store, SubstrateBlock } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { max } from "lodash";
import { v4 } from "uuid";
import { Account, Balance } from "../model";
import { findByCriteria, findById, upsert } from "./common";
import {
  checkRpcAvailability,
  getAccountLockedBalances,
  getSystemAccountInfos,
} from "../services/apiCalls";
import {
  BALANCES_RPC_CALL_BLOCK_CHUNK_SIZE,
  BALANCES_RPC_CALL_BLOCK_HEIGHT_OFFSET,
  BALANCES_RPC_CALL_BLOCK_TIMESTAMP_OFFSET,
  LockId,
  RpcFunction,
} from "../constants";
import { AccountAddress } from "../customTypes";
import {
  createOrUpdateCachedAccount,
  deleteCachesAccounts,
  getAllCachedAccounts,
} from "./cachedAccount";
import {
  createOrUpdateFirstOfRpcBatchBlock,
  getFirstOfRpcBatchBlock,
} from "./firstOfRpcBatchBlock";
import { createOrUpdateAccount } from "./account";
import { timestampToDate } from "../utils/common";
import { getKusamaToken } from "./token";
import { createOrUpdateHistoricalBalance } from "./historicalBalance";
import { convertAddressToSubstrate } from "../utils/addressConvertor";
import { getKusamaChain } from "./chain";
import {
  logMethodExecutionEnd,
  logMethodExecutionStart,
} from "./debugMethodExecutionTime";

export const getBalance = (
  store: Store,
  id: string
): Promise<Balance | undefined> => findById(store, Balance, id);

export const getAccountBalance = (
  store: Store,
  account: Account
): Promise<Balance | undefined> => {
  return findByCriteria(store, Balance, { where: { account } });
};

export const createOrUpdateBalance = (
  store: Store,
  data: DeepPartial<Balance>
): Promise<Balance> => upsert(store, Balance, data);

/*
 * create accounts;
 * store them in the temporal storage;
 * update balances for them every 100 blocks;
 * */
export const storeAccountAndUpdateBalances = async (
  store: Store,
  block: SubstrateBlock,
  accountAddresses: AccountAddress[] // in Kusama format only!
): Promise<Account[]> => {
  const kusamaChain = await getKusamaChain(store);
  // create accounts for given addresses if not exist
  const accounts = await Promise.all(
    // this approach is acceptable until accountAddress.length <= 2
    accountAddresses.map((accountAddress) =>
      createOrUpdateAccount(store, {
        id: accountAddress,
        chain: kusamaChain,
        substrateAccount: convertAddressToSubstrate(accountAddress),
      })
    )
  );
  // store given accounts for the further RPC call
  await Promise.all(
    accountAddresses.map((accountAddress) =>
      createOrUpdateCachedAccount(store, { accountId: accountAddress })
    )
  );

  const firstOfRpcBatchBlock = await getFirstOfRpcBatchBlock(store);
  if (!firstOfRpcBatchBlock) {
    await createOrUpdateFirstOfRpcBatchBlock(store, block);
    return accounts;
  }
  // Idea is to collect data for accounts each 100 blocks or at least for yesterday :)
  if (
    block.height - firstOfRpcBatchBlock.height >=
      BALANCES_RPC_CALL_BLOCK_HEIGHT_OFFSET ||
    block.timestamp - firstOfRpcBatchBlock.timestamp.valueOf() >=
      BALANCES_RPC_CALL_BLOCK_TIMESTAMP_OFFSET
  ) {
    await logMethodExecutionStart(
      store,
      block,
      "storeAccountAndUpdateBalances"
    );
    const usageBefore = process.memoryUsage().heapUsed;
    const cachedAccounts = await getAllCachedAccounts(
      store,
      BALANCES_RPC_CALL_BLOCK_CHUNK_SIZE
    );

    const cashedAccountIds = cachedAccounts.map(({ accountId }) => accountId);
    try {
      const accountDataCollection = await getAccountData(
        cashedAccountIds,
        block
      );

      const kusamaToken = await getKusamaToken(store);

      await Promise.all(
        Object.entries(accountDataCollection).map(
          async ([accountId, accountBalances]) => {
            const account = cachedAccounts.find(
              ({ accountId: id }) => accountId === id
            )?.account;
            if (!account) {
              return;
            }

            const balance = await getAccountBalance(store, account);
            if (
              !balance ||
              balance.reservedBalance !== accountBalances.reservedBalance ||
              balance.freeBalance !== accountBalances.freeBalance ||
              balance.lockedBalance !== accountBalances.lockedBalance ||
              balance.bondedBalance !== accountBalances.bondedBalance ||
              balance.vestedBalance !== accountBalances.vestedBalance ||
              balance.democracyBalance !== accountBalances.democracyBalance ||
              balance.electionBalance !== accountBalances.electionBalance
            ) {
              await createOrUpdateBalance(store, {
                id: balance?.id ?? v4().toString(),
                account,
                token: kusamaToken,
                ...accountBalances,
              });
              await createOrUpdateHistoricalBalance(store, {
                id: v4().toString(),
                timestamp: timestampToDate(block),
                account,
                token: kusamaToken,
                ...accountBalances,
              });
            }
          }
        )
      );

      // adjust first block on current
      await createOrUpdateFirstOfRpcBatchBlock(store, block);
      // remove all cached, since they all already processed
      // await pruneAllCachedAccounts(store);
      await deleteCachesAccounts(store, cashedAccountIds);
    } catch (error) {
      // if faced an error - postpone processing on BALANCES_RPC_CALL_BLOCK_HEIGHT_OFFSET blocks
      await createOrUpdateFirstOfRpcBatchBlock(store, block);
    }

    const usageAfter = process.memoryUsage().heapUsed;

    await logMethodExecutionEnd(
      store,
      "storeAccountAndUpdateBalances",
      block,
      usageAfter - usageBefore
    );
  }
  return accounts;
};

/**
 * NOTES ON DERIVING balance types from storage functions
 *
 * example account: EtHKJCxSzgwYjVRkDwAq3Kuqjxd41rKYYTpxRsdAPZEsPcP
 * https://kusama.subscan.io/account/EtHKJCxSzgwYjVRkDwAq3Kuqjxd41rKYYTpxRsdAPZEsPcP
 *
 * a) querying system.accounts storage function gives me:
 *
 * system.account: FrameSystemAccountInfo
 * {
 *   nonce: 8
 *   consumers: 1
 *   providers: 1
 *   sufficients: 0
 *   data: {
 *     free: 50,336,614,021,824,276
 *     reserved: 68,586,646,800
 *     miscFrozen: 50,323,694,209,654,204
 *     feeFrozen: 50,323,694,209,654,204
 *   }
 * }
 *
 * locked_balance = miscFrozen
 * free_balance = free
 * reserved_balance = reserved
 *
 *
 * b)querying balances.locks storage function gives me:
 *
 * balances.locks: Vec<PalletBalancesBalanceLock>
 * [
 *   {
 *     id: staking
 *     amount: 50,323,694,209,654,204
 *     reasons: All
 *   }
 *   {
 *     id: democrac
 *     amount: 50,000,000,000,000,000
 *     reasons: Misc
 *   }
 *   {
 *     id: phrelect
 *     amount: 50,323,694,200,000,000
 *     reasons: All
 *   }
 * ]
 *
 * ^
 * bonded_balance = staking
 * vested_balance = vesting**
 * democracy _balance = democrac
 * election_blance = phrelect
 * locked_balance = the type of lock with the highest amount locked.
 *
 * **note this account has no funds vesting so it doesn’t show up in the above response
 * @param accountAddresses
 * @param block
 * @returns {Promise<void>}
 */
export const getAccountData = async (
  accountAddresses: string[],
  block: SubstrateBlock
): Promise<Record<string, AccountBalances>> => {
  // check rpc function availability
  if (
    !checkRpcAvailability({ block }, RpcFunction.systemAccountInfo) ||
    !checkRpcAvailability({ block }, RpcFunction.lockedBalances)
  ) {
    throw new Error("Functions are not available");
  }

  // get data and assign it to the corresponding account at the same time
  const infos = await getSystemAccountInfos(accountAddresses, block);
  const locks = await getAccountLockedBalances(accountAddresses, block);

  // prepare data structure
  const accountMap = accountAddresses.reduce((acc, accountAddress) => {
    return {
      ...acc,
      [accountAddress]: {
        systemAccountData: infos[accountAddress],
        lockedBalancesData: locks[accountAddress],
      },
    };
  }, {} as Record<string, { systemAccountData?: SystemAccountData; lockedBalancesData?: Array<LockedBalancesData> }>);

  // calculate balances
  return Object.entries(accountMap).reduce(
    (acc, [accountId, { systemAccountData, lockedBalancesData }]) => {
      const bondedBalance =
        lockedBalancesData?.find(({ id }) => id === LockId.staking)?.amount ??
        null;
      const vestedBalance =
        lockedBalancesData?.find(({ id }) => id === LockId.vesting)?.amount ??
        null;
      const democracyBalance =
        lockedBalancesData?.find(({ id }) => id === LockId.democrac)?.amount ??
        null;
      const electionBalance =
        lockedBalancesData?.find(({ id }) => id === LockId.phrelect)?.amount ??
        null;

      acc[accountId] = {
        lockedBalance:
          max([
            bondedBalance,
            vestedBalance,
            democracyBalance,
            electionBalance,
          ]) ?? systemAccountData?.data.miscFrozen,
        freeBalance: systemAccountData?.data.free,
        reservedBalance: systemAccountData?.data.reserved,
        bondedBalance,
        vestedBalance,
        democracyBalance,
        electionBalance,
      };

      return acc;
    },
    {} as Record<string, AccountBalances>
  );
};

type AccountBalances = Pick<
  Balance,
  | "reservedBalance"
  | "freeBalance"
  | "lockedBalance"
  | "bondedBalance"
  | "vestedBalance"
  | "democracyBalance"
  | "electionBalance"
>;

type SystemAccountData = {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: {
    free: bigint | null;
    reserved: bigint | null;
    miscFrozen: bigint | null;
    feeFrozen: bigint | null;
  };
};

type LockedBalancesData = {
  id: LockId;
  amount: bigint;
  reasons: string;
};
