import { Store, SubstrateBlock } from "@subsquid/substrate-processor";
import { FirstOfRpcBatchBlock, FirstOfRpcBatchBlockRowId } from "../model";
import { findById, upsert } from "./common";
import { timestampToDate } from "../utils/common";
import { BALANCES_RPC_BLOCK_TIMESTAMP_OFFSET } from "../constants";

let cache: FirstOfRpcBatchBlock | undefined;

export const getFirstOfRpcBatchBlock = async (
  store: Store,
  block: SubstrateBlock
): Promise<FirstOfRpcBatchBlock | undefined> => {
  if (
    !cache ||
    block.timestamp - cache.timestamp.valueOf() >=
      BALANCES_RPC_BLOCK_TIMESTAMP_OFFSET
  ) {
    cache = await findById(
      store,
      FirstOfRpcBatchBlock,
      FirstOfRpcBatchBlockRowId.block
    );
  }
  return cache;
};

export const createOrUpdateFirstOfRpcBatchBlock = async (
  store: Store,
  block: SubstrateBlock
): Promise<FirstOfRpcBatchBlock> => {
  cache = await upsert(store, FirstOfRpcBatchBlock, {
    id: FirstOfRpcBatchBlockRowId.block,
    height: block.height,
    timestamp: timestampToDate(block),
  });
  return cache;
};
