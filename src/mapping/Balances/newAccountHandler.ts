import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import {
  BalancesEndowedEvent,
  BalancesNewAccountEvent,
} from "../../types/events";
import { createNewAccount } from "../utils/common";
import { timestampToDate, toKusamaFormat } from "../utils/utils";
import { cacheNewAccountEvents } from "../utils/cacheNewAccountEvents";

type EventType = { to: string; balance: bigint };

export const newAccountHandler: EventHandler = async (ctx): Promise<void> => {
  const { block, extrinsic, store } = ctx;
  const { to, balance } = getEvent(ctx);

  const blockNumber = block.height;

  // Clear cache for a new block
  cacheNewAccountEvents[blockNumber] = cacheNewAccountEvents[blockNumber]
    ? cacheNewAccountEvents[blockNumber]
    : {};

  // Since a transfer can also cause a new account event
  // we are caching such events to avoid adding new balance again
  cacheNewAccountEvents[blockNumber][to] =
    cacheNewAccountEvents[blockNumber][to] || {};
  cacheNewAccountEvents[blockNumber][to] = {
    extrinsicId: extrinsic?.id,
    amount: balance,
  };

  await createNewAccount(to, balance, 0n, timestampToDate(block), store);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  if (ctx.event.name === "balances.Endowed") {
    const event = new BalancesEndowedEvent(ctx);
    if (event.isV1050) {
      const [to, balance] = event.asV1050;
      return { to: toKusamaFormat(to), balance };
    }
    const { account, freeBalance } = event.asLatest;
    return { to: toKusamaFormat(account), balance: freeBalance };
  }

  const event = new BalancesNewAccountEvent(ctx);

  const [to, balance] = event.asLatest;

  return { to: toKusamaFormat(to), balance };
};
