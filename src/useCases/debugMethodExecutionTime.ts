import { Store, SubstrateBlock } from "@subsquid/substrate-processor";
import { DeepPartial } from "typeorm";
import { DebugMethodExecutionTime } from "../model";
import { findById } from "./common";

const DB_IO_BLOCK_PERIOD = 10;
let lastBlockInMemory = 0;
const shouldCallDB = (currentBlockAtWork: number) => {
  if (currentBlockAtWork - lastBlockInMemory > DB_IO_BLOCK_PERIOD) {
    lastBlockInMemory = currentBlockAtWork;
    return true;
  }
  return false;
};

const cache: Map<string, DeepPartial<DebugMethodExecutionTime> | undefined> =
  new Map();

const getDebugMethodExecutionTime = async (
  store: Store,
  id: string,
  currentBlockAtWork: number
): Promise<DebugMethodExecutionTime | undefined> => {
  if (shouldCallDB(currentBlockAtWork)) {
    const log = await findById(store, DebugMethodExecutionTime, id);
    if (!log) {
      return cache.get(id) as DebugMethodExecutionTime;
    }
    return log;
  }
  return cache.get(id) as DebugMethodExecutionTime;
};

const createOrUpdateDebugMethodExecutionTime = async (
  store: Store,
  data: DeepPartial<DebugMethodExecutionTime>
) => {
  if (data.currentBlockAtWork && shouldCallDB(data.currentBlockAtWork)) {
    cache.set(data.id || "", data);

    const entities = store.create(
      DebugMethodExecutionTime,
      Array.from(cache.values()) as DebugMethodExecutionTime[]
    );

    await store.save(entities);
  }
  cache.set(data.id || "", data);
};

export const logMethodExecutionStart = (
  store: Store,
  block: SubstrateBlock,
  methodName: string
): Promise<void> => {
  return createOrUpdateDebugMethodExecutionTime(store, {
    id: methodName,
    execStartAt: new Date(),
    currentBlockAtWork: block.height,
  });
};

export const logMethodExecutionEnd = async (
  store: Store,
  methodName: string,
  block: SubstrateBlock,
  memoryUsage: number,
  metadata?: string
): Promise<void> => {
  const log = await getDebugMethodExecutionTime(
    store,
    methodName,
    block.height
  );
  if (!log) {
    return undefined;
  }

  const execEndAt = new Date();
  const execTime = execEndAt.valueOf() - log.execStartAt.valueOf();

  const newLog: DebugMethodExecutionTime = {
    ...log,
    execEndAt,
    maxExecTime: Math.max(
      execTime,
      log.maxExecTime?.valueOf() ?? Number.MIN_SAFE_INTEGER
    ),
    minExecTime: Math.min(
      execTime,
      log.minExecTime?.valueOf() ?? Number.MAX_SAFE_INTEGER
    ),
    currentBlockAtWork: block.height,
    maxMemoryUsage: Math.max(
      memoryUsage,
      log.maxMemoryUsage ?? Number.MIN_SAFE_INTEGER
    ),
    minMemoryUsage: Math.min(
      memoryUsage,
      log.minMemoryUsage ?? Number.MAX_SAFE_INTEGER
    ),
    metadata,
  };
  try {
    return await createOrUpdateDebugMethodExecutionTime(store, newLog);
  } catch (error) {
    return console.error("Cannot store log", {
      newLog,
      error,
    });
  }
};
