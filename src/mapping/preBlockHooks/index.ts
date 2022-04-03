// Temporary work around till we see a solution
// to work with different chains

import {
  BlockHandler,
  BlockHandlerContext,
} from "@subsquid/substrate-processor";
import * as fs from "fs";
import * as path from "path";
import { STASH_FILES } from "../../constants";
import {
  createOrUpdateKusamaAccount,
  initializeChronicle,
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

export const loadGenesisData: BlockHandler = async (ctx): Promise<void> => {
  const { store } = ctx;

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
        // Iterating extrinsics
        return blockElement.events.map((extrinsicItem) => {
          const newAccounts = extrinsicItem.events.filter(
            // Iterating through each events
            (element) =>
              element.method === "NewAccount" && element.section === "balances"
          );
          return newAccounts.forEach((account) => {
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

  await initializeSquid({ store } as BlockHandlerContext);

  await Promise.all(
    newAccountData.map(async ({ address }) => {
      await createOrUpdateKusamaAccount(
        store,
        convertAddressToSubstrate(address)
      );
    })
  );
  console.log("BlocksStash successfully processed.");
};

export const initializeSquid: BlockHandler = async ({ store }) => {
  await initializeKusamaChain(store);
  await initializeChronicle(store);
};
