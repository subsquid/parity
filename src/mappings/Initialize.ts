import { EventContext, StoreContext } from "@subsquid/hydra-common";
import {
  NATIVE_TOKEN_DETAILS,
  RELAY_CHAIN_DETAILS,
  STASH_FILES,
} from "../constants";
import { Chains, Token } from "../generated/model";
import fs from "fs";
import path from "path";
import { createNewAccount } from "./Balances";
import { convertAddressToSubstrate } from "./helpers/common";

// Temporary work around till we see a solution
// to work with different chains

export interface Blocks {
  blockEvents: BlockEvent[];
}

export interface BlockEvent {
  blockNumber: number;
  events: Extrinsics[];
}

export interface Extrinsics {
  name: Name;
  events: Event[];
}

export interface Event {
  method: Method;
  section: Section;
  data: Array<string | number>;
  index: string;
}

export enum Method {
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

export enum Section {
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

export interface Timestamp {
  timestamps: TimestampElement[];
}

export interface TimestampElement {
  blockNumber: number;
  timestamp: number;
}

export const loadGenesisData = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  console.log("Initializing Indexer with defaults");

  const nativeToken = new Token({
    id: NATIVE_TOKEN_DETAILS.id,
    tokenName: NATIVE_TOKEN_DETAILS.tokenName,
    tokenSymbol: NATIVE_TOKEN_DETAILS.tokenSymbol,
  });

  await store.save(nativeToken);

  const relayChain = new Chains({
    id: RELAY_CHAIN_DETAILS.id,
    nativeToken: nativeToken,
    chainName: RELAY_CHAIN_DETAILS.chainName,
    relayId: RELAY_CHAIN_DETAILS.id,
    relayChain: RELAY_CHAIN_DETAILS.relayChain,
  });

  await store.save(relayChain);
  console.log("Initializing Indexer with defaults completed");
  console.log("Starting to take up initial bootstrap");

  let allNewAccountPromises: Array<Promise<any>> = [];
  let timestamp: Timestamp = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname + `/../../blocksStash/timestamp.json`),
      "utf8"
    )
  );
  STASH_FILES.map((file) => {
    let events: Blocks = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname + `/../../blocksStash/${file}`),
        "utf8"
      )
    );
    return events.blockEvents.map(
      // Iterating through each block
      (blockElement) => {
        console.log("Processing  block:", blockElement.blockNumber);
        // Iterating extrinsics
        return blockElement.events.map((extrinsicItem) => {
          let newAccounts = extrinsicItem.events.filter(
            // Iterating through each events
            (element) =>
              element.method === "NewAccount" && element.section === "balances"
          );
          return newAccounts.map((account) => {
            console.log("Creating new Account", account.data[0]);
            allNewAccountPromises.push(
              createNewAccount(
                convertAddressToSubstrate(`${account.data[0]}`),
                BigInt(account.data[1]),
                0n,
                new Date(
                  timestamp.timestamps[blockElement.blockNumber].timestamp
                ),
                store
              )
            );
          });
        });
      }
    );
  });
  await Promise.all(allNewAccountPromises);
};
