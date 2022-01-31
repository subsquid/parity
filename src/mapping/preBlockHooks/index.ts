// Temporary work around till we see a solution
// to work with different chains

import { BlockHandler } from "@subsquid/substrate-processor";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import { STASH_FILES } from "../../constants";
import {
  createOrUpdateKusamaAccount,
  initializeKusamaChain,
} from "../../useCases";
import { convertAddressToSubstrate } from "../../utils/addressConvertor";

interface Blocks {
  blockEvents: BlockEvent[];
}

interface BlockEvent {
  blockNumber: number;
  events: Extrinsics[];
}

interface Extrinsics {
  name: Name;
  events: Event[];
}

interface Event {
  method: Method;
  section: Section;
  data: Array<string | number>;
  index: string;
}

enum Method {
  AllGood = "AllGood",
  Claimed = "Claimed",
  Deposit = "Deposit",
  ExtrinsicSuccess = "ExtrinsicSuccess",
  NewAccount = "NewAccount",
  NewAccountIndex = "NewAccountIndex",
  NewSession = "NewSession",
  NewTerm = "NewTerm",
  SudoAsDone = "SudoAsDone",
}

enum Section {
  Balances = "balances",
  Claims = "claims",
  ElectionsPhragmen = "electionsPhragmen",
  IMOnline = "imOnline",
  Indices = "indices",
  Session = "session",
  Sudo = "sudo",
  System = "system",
  Treasury = "treasury",
}

export enum Name {
  ClaimsClaim = "claims.claim",
  FinalityTrackerFinalHint = "finalityTracker.finalHint",
  ParachainsSetHeads = "parachains.setHeads",
  SudoSudoAs = "sudo.sudoAs",
  TimestampSet = "timestamp.set",
}

interface Timestamp {
  timestamps: TimestampElement[];
}

interface TimestampElement {
  blockNumber: number;
  timestamp: number;
}

let numberOfCalls = 0;

export const loadGenesisData: BlockHandler = async (ctx): Promise<void> => {
  if (numberOfCalls) {
    return;
  }
  numberOfCalls += 1;

  const { store } = ctx;

  const schemas = (await store.query(
    "SELECT nspname FROM pg_catalog.pg_namespace;"
  )) as Array<{ nspname: string }>;
  if (
    schemas.find(({ nspname }) =>
      ["kusama_processor_status", "public"].includes(nspname)
    )
  ) {
    await store.query(
      `
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;     

DROP SCHEMA kusama_processor_status CASCADE;
CREATE SCHEMA kusama_processor_status;

COMMIT;
      `
    );
    process.exit(0);
  }

  console.log("Initializing Indexer with defaults");
  console.log("Initializing Indexer with defaults completed");
  console.log("Starting to take up initial bootstrap");

  await util
    .promisify(fs.readdir)(path.resolve(process.cwd(), "./lib"))
    .then((files) => {
      files.forEach((file) => {
        // Do whatever you want to do with the file
        console.log(file);
      });
    });

  const timestampJSON = JSON.parse(
    fs.readFileSync(
      path.resolve(`${__dirname}/../../../blocksStash/timestamp.json`),
      "utf8"
    )
  ) as Timestamp;
  const newAccountData: Array<{
    address: string;
    freeBalance: bigint;
    timestamp: Date;
  }> = [];

  STASH_FILES.map((file) => {
    const events = JSON.parse(
      fs.readFileSync(
        path.resolve(`${__dirname}/../../../blocksStash/${file}`),
        "utf8"
      )
    ) as Blocks;
    return events.blockEvents.map(
      // Iterating through each block
      (blockElement) => {
        console.log("Processing  block:", blockElement.blockNumber);
        // Iterating extrinsics
        return blockElement.events.map((extrinsicItem) => {
          const newAccounts = extrinsicItem.events.filter(
            // Iterating through each events
            (element) =>
              element.method === "NewAccount" && element.section === "balances"
          );
          return newAccounts.forEach((account) => {
            console.log("Creating new Account", account.data[0]);
            newAccountData.push({
              address: account.data[0] as string,
              freeBalance: BigInt(account.data[1]),
              timestamp: new Date(
                timestampJSON.timestamps[blockElement.blockNumber].timestamp
              ),
            });
          });
        });
      }
    );
  });

  await initializeKusamaChain(store);

  await Promise.all(
    newAccountData.map(async ({ address }) => {
      await createOrUpdateKusamaAccount(
        store,
        convertAddressToSubstrate(address)
      );
    })
  );
};
