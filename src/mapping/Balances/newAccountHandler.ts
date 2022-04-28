import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesNewAccountEvent } from "../../types/generated/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";

type EventType = { account: AccountAddress; balance: bigint };

export const newAccountHandler: EventHandler = async (ctx): Promise<void> => {
  const { block, store } = ctx;
  const { account } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [account]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new BalancesNewAccountEvent(ctx);

  const [account, balance] = event.asLatest;

  return { account: toKusamaFormat(account), balance };
};
