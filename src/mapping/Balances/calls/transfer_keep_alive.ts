import { ExtrinsicHandlerContext } from "@subsquid/substrate-processor";
import { BalancesTransferKeepAliveCall } from "../../../types/generated/calls";
import {
  createTransfer,
  getOrCreateKusamaToken,
  storeAccountToUpdateBalances,
} from "../../../useCases";
import { timestampToDate } from "../../../utils/common";
import { toKusamaFormat } from "../../../utils/addressConvertor";
import { UnknownVersionError } from "../../../utils/errors";

const getCallData = (ctx: ExtrinsicHandlerContext) => {
  const call = new BalancesTransferKeepAliveCall(ctx);
  if (call.isV1020) {
    return undefined;
  }
  if (call.isV1050) {
    const { dest, value } = call.asV1050;
    return {
      to: toKusamaFormat(dest),
      amount: value,
    };
  }
  if (call.isV2028) {
    const { dest, value } = call.asV2028;
    return {
      to: toKusamaFormat(dest.value as Uint8Array),
      amount: value,
    };
  }
  if (call.isV9111) {
    const { dest, value } = call.asV9111;
    return {
      to: toKusamaFormat(dest.value as Uint8Array),
      amount: value,
    };
  }
  throw new UnknownVersionError(call.constructor.name);
};

export const handleTransferKeepAlive = async (ctx: ExtrinsicHandlerContext) => {
  const data = getCallData(ctx);
  if (!data) return;

  const { store, block, event, extrinsic } = ctx;

  const [accountFrom, accountTo] = await storeAccountToUpdateBalances(
    store,
    block,
    [extrinsic.signer, data.to]
  );

  await createTransfer(store, {
    id: event.id,
    senderAccount: accountFrom,
    receiverAccount: accountTo,
    token: await getOrCreateKusamaToken(store),
    amount: data.amount,
    timestamp: timestampToDate(block),
    successful: false,
  });
};
