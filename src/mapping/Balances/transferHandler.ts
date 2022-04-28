import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesTransferEvent } from "../../types/generated/events";
import {
  createTransfer,
  getOrCreateKusamaToken,
  storeAccountToUpdateBalances,
} from "../../useCases";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { AccountAddress } from "../../customTypes";
import { timestampToDate } from "../../utils/common";

type TransferEvent = {
  from: AccountAddress;
  to: AccountAddress;
  amount: bigint;
};

export const transferHandler: EventHandler = async (ctx) => {
  const { store, block, event } = ctx;
  const { from, to, amount } = getTransferEvent(ctx);

  const [accountFrom, accountTo] = await storeAccountToUpdateBalances(
    store,
    block,
    [from, to]
  );

  await createTransfer(store, {
    id: event.id,
    senderAccount: accountFrom,
    receiverAccount: accountTo,
    token: await getOrCreateKusamaToken(store),
    amount,
    timestamp: timestampToDate(block),
    successful: true,
  });
};

const getTransferEvent = (ctx: EventHandlerContext): TransferEvent => {
  const event = new BalancesTransferEvent(ctx);
  if (event.isV1020) {
    const [from, to, amount] = event.asV1020;
    return { from: toKusamaFormat(from), to: toKusamaFormat(to), amount };
  }
  if (event.isV1050) {
    const [from, to, amount] = event.asV1050;
    return { from: toKusamaFormat(from), to: toKusamaFormat(to), amount };
  }
  const { from, to, amount } = event.asLatest;
  return { from: toKusamaFormat(from), to: toKusamaFormat(to), amount };
};
