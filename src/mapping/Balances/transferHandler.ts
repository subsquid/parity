import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { v4 } from "uuid";
import { BalancesTransferEvent } from "../../types/events";
import {
  createOrUpdateTransfer,
  getKusamaToken,
  storeAccountAndUpdateBalances,
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
  const { store, block } = ctx;
  const { from, to, amount } = getTransferEvent(ctx);

  const [accountFrom, accountTo] = await storeAccountAndUpdateBalances(
    store,
    block,
    [from, to]
  );

  await createOrUpdateTransfer(store, {
    id: v4().toString(),
    senderAccount: accountFrom,
    receiverAccount: accountTo,
    token: await getKusamaToken(store),
    amount,
    timestamp: timestampToDate(block),
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
