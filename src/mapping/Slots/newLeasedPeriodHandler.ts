import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { SlotsNewLeasePeriodEvent } from "../../types/events";
import { CHRONICLE_KEY } from "../../constants";
import { Chronicle } from "../../model";
import { apiService } from "../utils/api";
import { getOrUpdate } from "../utils/utils";

type EventType = { leaseIndex: number };

export const newLeasedPeriodHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store, block } = ctx;
  const { leaseIndex } = getEvent(ctx);

  // TODO: Check this api out to use block hash
  const api = await apiService();
  const leasePeriod = api.consts.slots.leasePeriod.toJSON() as number;
  const timestamp: number = Math.round(block.timestamp / 1000);
  const newValue = {
    curLease: leaseIndex,
    curLeaseStart: timestamp,
    curLeaseEnd: timestamp + leasePeriod - 1,
  };

  await getOrUpdate(store, Chronicle, CHRONICLE_KEY, newValue);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new SlotsNewLeasePeriodEvent(ctx);

  return { leaseIndex: event.asLatest };
};
