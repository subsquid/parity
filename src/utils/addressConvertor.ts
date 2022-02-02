import * as ss58 from "@subsquid/ss58";
import { encodeAddress } from "@polkadot/util-crypto";
import { AccountAddress } from "../customTypes";

const kusamaCodec = ss58.codec("kusama");
export const toKusamaFormat = (data: Uint8Array): AccountAddress => {
  return kusamaCodec.encode(data);
};

const substrateCodec = ss58.codec("substrate");
export const toSubstrateFormat = (data: Uint8Array): AccountAddress => {
  return substrateCodec.encode(data);
};

export const kusamaToSubstrateFormat = (
  kusamaFormat: string
): AccountAddress => {
  return toSubstrateFormat(kusamaCodec.decode(kusamaFormat));
};

export const substrateToKusamaFormat = (
  substrateFormat: string
): AccountAddress => {
  return toKusamaFormat(substrateCodec.decode(substrateFormat));
};

// todo; deal with deprecated

// @deprecated
export function convertAddressToSubstrate(address: string): string {
  return (address && encodeAddress(address, 42)) || "";
}

// @deprecated
export function convertAddressToKusama(address: string): string {
  return (address && encodeAddress(address, 2)) || "";
}
