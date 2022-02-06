import * as ss58 from "@subsquid/ss58";
import { SubstrateBlock } from "@subsquid/substrate-processor";

export const parseNumber = (hexOrNum: string | number | undefined): number => {
  if (!hexOrNum) {
    return 0;
  }
  return typeof hexOrNum === "string"
    ? parseInt(hexOrNum.replace(/^0x/, ""), 16) || 0
    : hexOrNum;
};

export const timestampToDate = (block: SubstrateBlock): Date => {
  return new Date(block.timestamp);
};

export const getChainName = (chainId: number) => {
  try {
    // there are a lot of chains not listed in the registry
    return ss58.registry.get(chainId).displayName;
  } catch (error) {
    return "";
  }
};
