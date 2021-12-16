import { EventContext, StoreContext } from "@subsquid/hydra-common";
import { createNewAccount, getBalance, getBalanceFromRPC } from ".";
import { RELAY_CHAIN_DETAILS } from "../constants";
import { Account, Chains } from "../generated/model";
import { Registrar } from "../types";
import { apiService } from "./helpers/api";
import { get, timestampToDate } from "./helpers/common";

export const handleParachainRegistered = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [paraId, managerId] = new Registrar.RegisteredEvent(event).params;
  const parachain = new Chains({
    paraId: paraId.toNumber(),
    relayChain: false,
    relayId: RELAY_CHAIN_DETAILS.id,
  });

  let managerAccount = await get(store, Account, managerId.toString());
  if (managerAccount == undefined) {
    const balance = await getBalanceFromRPC(block, managerId.toString());
    [managerAccount] = await createNewAccount(
      managerId.toString(),
      balance.free,
      balance.reserve,
      timestampToDate(block),
      store
    );
  }

  const api = await apiService(block.hash);
  const { deposit } =
    (await api.query.registrar.paras(paraId)).toJSON() ||
    ({ deposit: 0 } as any);

  parachain.createdAt = new Date(block.timestamp);
  parachain.manager = managerAccount;
  parachain.deposit = deposit;
  parachain.creationBlock = block.height;
  parachain.deregistered = false;

  await store.save(parachain);
};

export const handleDeRegistered = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [paraId] = new Registrar.DeregisteredEvent(event).params;
  const chain = await get(store, Chains, "", { paraId: paraId.toNumber() });
  if (chain === undefined || chain === null) {
    console.log("Chain not found with paraId ", paraId.toNumber());
    return;
  }
  chain.deregistered = true;
  await store.save(chain);
};
