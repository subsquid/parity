import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { BalancesTransferEvent } from "../../types/events";
import { Transfers } from "../../model";
import { accountBalanceTransfer } from "../utils/common";
import { timestampToDate, toKusamaFormat } from "../utils/utils";
import { NativeToken } from "../utils/nativeToken";

type TransferEvent = { from: string; to: string; amount: bigint };

export const transferHandler: EventHandler = async (ctx) => {
  const { extrinsic, store, block, event } = ctx;
  const { from, to, amount } = getTransferEvent(ctx);

  const [accountFrom, accountTo] = await accountBalanceTransfer(
    from,
    to,
    amount,
    false,
    false,
    extrinsic,
    store,
    block
  );

  if (!NativeToken.token) {
    await NativeToken.setAndGetTokenDetails(store);
  }

  const transfer = new Transfers({
    id: event.id,
    senderAccount: accountFrom,
    receiverAccount: accountTo,
    tokenId: NativeToken.token, // will have to change once fix is up
    amount,
    timestamp: timestampToDate(block),
  });

  await store.save(transfer);
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
