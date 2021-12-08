import { EventContext, StoreContext } from "@subsquid/hydra-common";
import { Parachain } from "../generated/model";
import { Registrar } from "../types";
import { apiService } from "./helpers/api";
import { getOrCreate } from "./helpers/common";

export const handleParachainRegistered = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {

  const [paraId, managerId] = new Registrar.RegisteredEvent(event).params;
  const parachain = await getOrCreate(store, Parachain, `${paraId}-${managerId.toString()}`);

  /**
   * Api changes as per the new AT syntax
   */
  const api = await apiService();
  const apiAt = await api.at(block.hash);
  const { deposit } = (await apiAt.query.registrar.paras(paraId)).toJSON() || ({ deposit: 0 } as any);

  parachain.paraId = paraId.toNumber();
  parachain.createdAt = new Date(block.timestamp);
  parachain.manager = managerId.toString();
  parachain.deposit = deposit;
  parachain.creationBlock = block.height;
  parachain.deregistered = false;

  await store.save(parachain);
}
