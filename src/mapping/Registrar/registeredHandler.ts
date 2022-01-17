import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { RegistrarRegisteredEvent } from "../../types/events";
import { Chains } from "../../model";
import { RELAY_CHAIN_DETAILS } from "../../constants";
import { apiService } from "../utils/api";
import { createAccountIfNotPresent } from "../utils/common";
import { toKusamaFormat } from "../utils/utils";

type EventType = { paraId: number; managerId: string };

export const registeredHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { paraId, managerId } = getEvent(ctx);

  const parachain = new Chains({
    id: `${paraId}-${managerId}`,
    paraId,
    relayChain: false,
    relayId: RELAY_CHAIN_DETAILS.id,
  });

  const [managerAccount] = await createAccountIfNotPresent(
    managerId,
    store,
    block
  );

  const api = await apiService(block.hash);
  const { deposit } = ((await api.query.registrar.paras(paraId)).toJSON() || {
    deposit: 0n,
  }) as { deposit?: bigint };

  parachain.createdAt = new Date(block.timestamp);
  parachain.manager = managerAccount;
  parachain.deposit = deposit;
  parachain.creationBlock = block.height;
  parachain.deregistered = false;
  parachain.relayChain = false;

  await store.save(parachain);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new RegistrarRegisteredEvent(ctx);

  const [paraId, managerId] = event.asLatest;
  return { paraId, managerId: toKusamaFormat(managerId) };
};
