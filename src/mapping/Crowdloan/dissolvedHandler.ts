import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { CrowdloanDissolvedEvent } from "../../types/events";
import { ensureFund } from "../utils/common";
import { CrowdloanStatus } from "../../constants";
import { timestampToDate } from "../utils/utils";

type EventType = { fundIndex: number };

export const dissolveHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { fundIndex } = getEvent(ctx);

  const { timestamp: createdAt } = block;
  const blockNum = block.height;
  await ensureFund(fundIndex, store, block, {
    status: CrowdloanStatus.DISSOLVED,
    isFinished: true,
    updatedAt: new Date(createdAt),
    dissolvedBlock: blockNum,
    dissolved: true,
    dissolvedDate: timestampToDate(block),
  });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new CrowdloanDissolvedEvent(ctx);

  return { fundIndex: event.asLatest };
};
