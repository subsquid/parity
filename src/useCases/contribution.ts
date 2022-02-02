import { Store } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { Contribution } from "../model";
import { findById, upsert } from "./common";

export const getContribution = (
  store: Store,
  id: string
): Promise<Contribution | undefined> => findById(store, Contribution, id);

export const createOrUpdateContribution = (
  store: Store,
  data: DeepPartial<Contribution>
): Promise<Contribution> => upsert(store, Contribution, data);
