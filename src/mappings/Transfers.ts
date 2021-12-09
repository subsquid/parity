import {
  DatabaseManager,
  EventContext,
  StoreContext,
  SubstrateBlock,
} from "@subsquid/hydra-common";
import { Account, Balance, Chain, Token, Transfer } from "../generated/model";
import { Balances } from "../types";
import { getOrCreate, timestampToDate } from "./helpers/common";
import { CHAIN_DETAILS, TOKEN_DETAILS } from "./helpers/consistenecy";

export const handleTransfer = async ({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> => {
  const [from, to, value] = new Balances.TransferEvent(event).params;
  const tip = extrinsic?.tip || 0n

  let transfer = await store.get(Transfer, {
    where: { id: block.height.toString() },
  });

  if (!transfer) {
    await handleAccountAndBalance(
      store,
      block,
      from.toString(),
      value.toBigInt(),
      true,
      tip
    );
    await handleAccountAndBalance(
      store,
      block,
      to.toString(),
      value.toBigInt(),
      false,
      tip
    );

    // token data check and creation
    let tokenData: Token | undefined = await store.get(Token, {
      where: { id: TOKEN_DETAILS.id }, // This is temporary until we got way to get the chain id and token id
    });

    if (!tokenData) {
      tokenData = new Token(TOKEN_DETAILS);
      await store.save(tokenData);
    }

    // account data creation and saving

    transfer = new Transfer({
      id: block.height.toString(),
      senderAccount: from.toString(),
      receiverAccount: to.toString(),
      tokenId: tokenData.id,
      amount: value.toBigInt(),
      timestamp: timestampToDate(block),
    });

    await store.save(transfer);
  }
};

const handleAccountAndBalance = async (
  store: DatabaseManager,
  block: SubstrateBlock,
  who: string,
  value: bigint,
  isFrom: boolean,
  tip: bigint
) => {
  let balance = await store.get(Balance, {
    where: { accountId: who },
  });

  let balanceValue: bigint = balance?.freeBalance || 0n;
  balanceValue = isFrom ? balanceValue - value - tip : balanceValue + value;

  let account = await store.get(Account, {
    where: { id: who },
  });

  // token data check and creation
  let tokenData: Token | undefined = await store.get(Token, {
    where: { id: TOKEN_DETAILS.id }, // This is temporary until we got way to get the chain id and token id
  });

  if (!tokenData) {
    tokenData = new Token(TOKEN_DETAILS);
    await store.save(tokenData);
  }

  // chain data check and creation
  // const chainID = `${block.height}-${who}` || CHAIN_DETAILS.id;
  let chainData: Chain | undefined = await store.get(Chain, {
    // where: { id: chainID }, // This is temporary until we got way to get the chain id and token id
    where: { id: CHAIN_DETAILS.id }, // This is temporary until we got way to get the chain id and token id
  });

  if (!chainData) {
    // CHAIN_DETAILS.id = chainID;
    CHAIN_DETAILS.id = CHAIN_DETAILS.id;
    chainData = new Chain(CHAIN_DETAILS);
    await store.save(chainData);
  }

  // account data check and creation
  if (!account) {
    account = new Account({
      id: who,
      chainId: CHAIN_DETAILS.id,
      balance: balanceValue,
    });
  } else {
    account.balance = isFrom ? (account.balance - (value + tip)) : (account.balance + value);
  }

  await store.save(account);

  if (!balance) {

    // account data saving
    balance = new Balance({
      id: block.height.toString(),
      accountId: account.id,
      tokenId: tokenData.id,
      timestamp: timestampToDate(block),
      freeBalance: balanceValue,
      bondedBalance: 0n,
    });

  } else {
    balance.freeBalance = balanceValue;
  }
  await store.save(balance);
};


export const handleBondedBalance = async ({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> => {
  const [accountId, bondedAmount] = new Balances.BondedEvent(event).params;

  let balance: Balance | undefined = await store.get(Balance, {
    where: { accountId: accountId.toString() },
  });

  if (balance) {
    let bondedBalance: bigint = balance.bondedBalance || 0n;
    bondedBalance = bondedBalance + (bondedAmount.toBigInt() || 0n);
    balance.bondedBalance = bondedBalance;
    await store.save(balance);
  }
}

export const handleUnBondedBalance = async ({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> => {
  const [accountId, bondedAmount] = new Balances.UnBondedEvent(event).params;


  let balance: Balance | undefined = await store.get(Balance, {
    where: { accountId: accountId.toString() },
  });

  if (balance) {
    let bondedBalance: bigint = balance.bondedBalance || 0n;
    bondedBalance = bondedBalance - (bondedAmount.toBigInt() || 0n);
    balance.bondedBalance = bondedBalance;
    await store.save(balance);
  }
}