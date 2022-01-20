// Temporary work around till we see a solution
// to work with different chains

import { BlockHandler } from "@subsquid/substrate-processor";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import { Chains, Token } from "../../model";
import {
  NATIVE_TOKEN_DETAILS,
  RELAY_CHAIN_DETAILS,
  STASH_FILES,
} from "../../constants";
import { createNewAccount } from "../utils/common";
import { convertAddressToSubstrate } from "../utils/utils";

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
  console.log("Initializing Indexer with defaults");

  const nativeToken = new Token({
    id: NATIVE_TOKEN_DETAILS.id,
    tokenName: NATIVE_TOKEN_DETAILS.tokenName,
    tokenSymbol: NATIVE_TOKEN_DETAILS.tokenSymbol,
  });

  await store.save(nativeToken);

  const relayChain = new Chains({
    id: RELAY_CHAIN_DETAILS.id,
    nativeToken,
    chainName: RELAY_CHAIN_DETAILS.chainName,
    relayId: RELAY_CHAIN_DETAILS.id,
    relayChain: RELAY_CHAIN_DETAILS.relayChain,
    creationBlock: 0,
    deregistered: false,
    deposit: 0n,
  });

  await store.save(relayChain);
  console.log("Initializing Indexer with defaults completed");
  console.log("Starting to take up initial bootstrap");

  console.log(
    "KRI;debug;",
    JSON.stringify(
      {
        cwd: process.cwd(),
        __dirname,
      },
      null,
      2
    )
  );

  await util
    .promisify(fs.readdir)(path.resolve(process.cwd(), "./lib"))
    .then((files) => {
      files.forEach((file) => {
        // Do whatever you want to do with the file
        console.log(file);
      });
    });

  // throw new Error("de fack u ar!");

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
  await Promise.all(
    newAccountData.map(async ({ address, timestamp, freeBalance }) => {
      await createNewAccount(
        convertAddressToSubstrate(address),
        freeBalance,
        0n,
        timestamp,
        store
      );
    })
  );
};
