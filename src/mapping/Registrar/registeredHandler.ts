import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { RegistrarRegisteredEvent } from "../../types/events";
import { AccountAddress } from "../../customTypes";
import {
  createOrUpdateChain,
  getKusamaChainId,
  storeAccountAndUpdateBalances,
} from "../../useCases";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { timestampToDate } from "../../utils/common";

type EventType = { paraId: number; managerId: AccountAddress };

export const registeredHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { paraId, managerId } = getEvent(ctx);

  await createOrUpdateChain(store, {
    id: `${paraId}`,
    name: `${paraId}-${managerId}`,
    relayChain: false,
    relayId: await getKusamaChainId(store),
    registeredAt: timestampToDate(block),
  });

  await storeAccountAndUpdateBalances(store, block, [managerId]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new RegistrarRegisteredEvent(ctx);

  const [paraId, managerId] = event.asLatest;
  return { paraId, managerId: toKusamaFormat(managerId) };
};
