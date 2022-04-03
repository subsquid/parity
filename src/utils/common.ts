import { SubstrateBlock } from "@subsquid/substrate-processor";
import { networkRegistry } from "@subsquid/archive-registry";

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
  return (
    networkRegistry.networks.find(
      ({ parachainId }) => parachainId && +parachainId === chainId
    )?.displayName || ""
  );
};
