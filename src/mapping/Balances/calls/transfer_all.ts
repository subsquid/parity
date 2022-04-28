import { ExtrinsicHandlerContext } from "@subsquid/substrate-processor";
import { BalancesTransferAllCall } from "../../../types/generated/calls";
import {
  createTransfer,
  getOrCreateKusamaToken,
  storeAccountToUpdateBalances,
} from "../../../useCases";
import { timestampToDate } from "../../../utils/common";
import { toKusamaFormat } from "../../../utils/addressConvertor";
import { UnknownVersionError } from "../../../utils/errors";

const getCallData = (ctx: ExtrinsicHandlerContext) => {
  const call = new BalancesTransferAllCall(ctx);
  if (call.isV9050) {
    const { dest } = call.asV9050;
    return {
      to: dest.value as Uint8Array,
    };
  }
  if (call.isV9111) {
    const { dest } = call.asV9111;
    return {
      to: dest.value as Uint8Array,
    };
  }
  throw new UnknownVersionError(call.constructor.name);
};

export const handleTransferAll = async (ctx: ExtrinsicHandlerContext) => {
  const data = getCallData(ctx);
  if (!data) return;

  const { store, block, event, extrinsic } = ctx;

  const [accountFrom, accountTo] = await storeAccountToUpdateBalances(
    store,
    block,
    [extrinsic.signer, toKusamaFormat(data.to)]
  );

  await createTransfer(store, {
    id: event.id,
    senderAccount: accountFrom,
    receiverAccount: accountTo,
    amount: null,
    token: await getOrCreateKusamaToken(store),
    timestamp: timestampToDate(block),
    successful: false,
  });
};
