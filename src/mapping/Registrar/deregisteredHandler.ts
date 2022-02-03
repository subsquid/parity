import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { RegistrarDeregisteredEvent } from "../../types/events";
import {
  createOrUpdateChain,
  getChain,
  getKusamaChainId,
  getKusamaToken,
} from "../../useCases";
import { timestampToDate } from "../../utils/common";

type EventType = { paraId: number };

export const deregisteredHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { paraId } = getEvent(ctx);

  const chain = await getChain(store, paraId);

  await createOrUpdateChain(store, {
    id: `${paraId}`,
    name: chain.name ?? "",
    relayChain: chain.relayChain ?? false,
    relayId: chain.relayId ?? (await getKusamaChainId(store)),
    registeredAt: chain.registeredAt ?? timestampToDate(block),
    deregisteredAt: timestampToDate(block),
    nativeToken: chain.nativeToken ?? (await getKusamaToken(store)),
  });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new RegistrarDeregisteredEvent(ctx);

  return { paraId: event.asLatest };
};
