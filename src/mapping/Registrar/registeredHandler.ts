import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { RegistrarRegisteredEvent } from "../../types/generated/events";
import { AccountAddress } from "../../customTypes";
import {
  createChain,
  getKusamaChainId,
  getOrCreateKusamaToken,
  storeAccountToUpdateBalances,
} from "../../useCases";
import { toKusamaFormat } from "../../utils/addressConvertor";
import { getChainName, timestampToDate } from "../../utils/common";

type EventType = { paraId: number; managerId: AccountAddress };

export const registeredHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { paraId, managerId } = getEvent(ctx);

  await createChain(store, {
    id: `${paraId}`,
    name: getChainName(paraId) || `${paraId}-${managerId}`,
    relayChain: false,
    relayId: await getKusamaChainId(store),
    registeredAt: timestampToDate(block),
    nativeToken: await getOrCreateKusamaToken(store),
    deregisteredAt: null,
    crowdloans: [],
  });

  await storeAccountToUpdateBalances(store, block, [managerId]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new RegistrarRegisteredEvent(ctx);

  const [paraId, managerId] = event.asLatest;
  return { paraId, managerId: toKusamaFormat(managerId) };
};
