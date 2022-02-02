import { Store, SubstrateBlock } from "@subsquid/substrate-processor";
import { FirstOfRpcBatchBlock, FirstOfRpcBatchBlockRowId } from "../model";
import { findById, upsert } from "./common";
import { timestampToDate } from "../utils/common";

export const getFirstOfRpcBatchBlock = (
  store: Store
): Promise<FirstOfRpcBatchBlock | undefined> => {
  return findById(store, FirstOfRpcBatchBlock, FirstOfRpcBatchBlockRowId.block);
};

export const createOrUpdateFirstOfRpcBatchBlock = (
  store: Store,
  block: SubstrateBlock
) => {
  return upsert(store, FirstOfRpcBatchBlock, {
    id: FirstOfRpcBatchBlockRowId.block,
    height: block.height,
    timestamp: timestampToDate(block),
  });
};
