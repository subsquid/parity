import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { StakingSlashedEvent } from "../../types/generated/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { storeAccountToUpdateBalances } from "../../useCases";

type EventType = { validator: AccountAddress; amount: bigint };

export const slashedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { validator } = getEvent(ctx);

  await storeAccountToUpdateBalances(store, block, [validator]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new StakingSlashedEvent(ctx);

  const [validator, amount] = event.asLatest;
  return { validator: toKusamaFormat(validator), amount };
};
