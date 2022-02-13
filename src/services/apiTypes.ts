import { ApiPromise } from "@polkadot/api";
import { ApiDecoration } from "@polkadot/api/types";
import { AccountAddress } from "../customTypes";
import { LockId } from "../constants";

export type ApiService = ApiPromise | ApiDecoration<"promise">;

export type JsonConvertable<T> = {
  toJSON: () => T;
};

export type CrowdloanInfo = {
  cap: bigint;
  depositor: string; // account address in any chain
  deposit: number;
  end: number;
  firstPeriod: number;
  lastContribution: {
    ending: number;
  };
  lastPeriod: number;
  raised: bigint;
  trieIndex: number;
  verifier: {
    sr25519?: string; // public key format
  };
};

export type SystemAccountData = {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: {
    free: bigint | null;
    reserved: bigint | null;
    miscFrozen: bigint | null;
    feeFrozen: bigint | null;
  };
};

export type LockedBalance = {
  id: LockId;
  amount: bigint;
  reasons: string;
};

export type ParachainInfo = {
  manager: AccountAddress;
  deposit: number;
  locked: boolean;
};
