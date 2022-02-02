import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { findById, upsert } from "./common";
import { CrowdloanSequence } from "../model";

export const getCrowdloanSequence = (
  store: Store,
  id: string
): Promise<CrowdloanSequence | undefined> =>
  findById(store, CrowdloanSequence, id);

export const createOrUpdateCrowdloanSequence = (
  store: Store,
  data: DeepPartial<CrowdloanSequence>
): Promise<CrowdloanSequence> => upsert(store, CrowdloanSequence, data);
