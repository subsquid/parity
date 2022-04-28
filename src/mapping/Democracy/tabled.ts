import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { DemocracyTabledEvent } from "../../types/generated/events";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";
import { UnknownVersionError } from "../../utils/errors";

export const tabledHandler: EventHandler = async (ctx) => {
  const { store, block } = ctx;
  const { depositors } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, depositors);
};

const getEvent = (ctx: EventHandlerContext) => {
  const event = new DemocracyTabledEvent(ctx);
  if (event.isV1020) {
    const [proposalIndex, deposit, depositors] = event.asV1020;
    return { depositors: depositors.map(toKusamaFormat) };
  }
  if (event.isV9130) {
    const { depositors } = event.asV9130;
    return { depositors: depositors.map(toKusamaFormat) };
  }

  throw new UnknownVersionError(event.constructor.name);
};
