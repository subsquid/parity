import { Account, Crowdloan } from "../../model";

type HexNumber = string;

export interface ParachainReturn {
  manager: string;
  deposit: number;
}

export interface CrowdloanReturn {
  retiring: boolean;
  depositor: Account;
  verifier: Account | null;
  deposit: number;
  raised: HexNumber;
  end: number;
  cap: HexNumber;
  lastContribution: {
    preEnding?: number[];
    ending: number[];
    never?: null;
  };
  firstPeriod: number;
  lastPeriod: number;
  trieIndex: number;
  createdAt: Date;
}

export type CrowdloanUpdater = keyof Crowdloan;
