// import { EventContext, StoreContext } from "@subsquid/hydra-common";
// import { CHRONICLE_KEY, IGNORE_PARACHAIN_IDS } from "../constants";
// import {
//   Auction,
//   Chronicle,
//   Parachain,
//   ParachainLeases,
// } from "../generated/model";
// import { Slots } from "../types";
// import { apiService } from "./helpers/api";
// import {
//   ensureFund,
//   ensureParachain,
//   getOrUpdate,
//   isFundAddress,
// } from "./helpers/common";
// import { CROWDLOAN_STATUS } from "../constants";
// import { parseNumber } from "./helpers/utils";

// let leasePeriod: number;

// const getLeasePeriod = async (hash: string): Promise<number> => {
//   if (!leasePeriod) {
//     const api = await apiService();
//     const apiAt = await api.at(hash);
//     leasePeriod = (apiAt.consts.slots?.leasePeriod.toJSON() as number) || -1;
//   }
//   return leasePeriod;
// };

// export const handleSlotsLeased = async ({
//   store,
//   event,
//   block,
// }: EventContext & StoreContext): Promise<void> => {
//   const blockNum = block.height;
//   const [paraId, from, firstLease, leaseCount, extra, total] =
//     new Slots.LeasedEvent(event).params;
//   const lastLease = firstLease.toNumber() + leaseCount.toNumber() - 1;

//   if (IGNORE_PARACHAIN_IDS.includes(paraId.toNumber())) {
//     return;
//   }

//   const { id: parachainId } = await ensureParachain(
//     paraId.toNumber(),
//     store,
//     block
//   );
//   const totalUsed = parseNumber(total.toString());
//   const extraAmount = parseNumber(extra.toString());

//   const [ongoingAuction] = await store.find(Auction, {
//     where: { ongoing: true },
//     take: 1,
//   });

//   const curAuction = ongoingAuction || {
//     id: "unknown",
//     resultBlock: blockNum,
//     leaseEnd: null,
//   };

//   if (curAuction.id === "unknown") {
//     await getOrUpdate(store, Auction, "unknown", {
//       id: "unknown",
//       blockNum,
//       status: "Closed",
//       slotsStart: 0,
//       slotsEnd: 0,
//       closingStart: 0,
//       closingEnd: 0,
//       ongoing: false,
//     });
//   }

//   const fundAddress = await isFundAddress(from.toString());

//   if (fundAddress) {
//     await ensureFund(paraId.toNumber(), store, block, {
//       status: CROWDLOAN_STATUS.WON,
//       wonAuctionId: curAuction.id,
//       leaseExpiredBlock: curAuction.leaseEnd,
//     }).catch((err) => {
//       console.error(`Upsert Crowdloan failed ${err}`);
//     });
//   }

//   const { id: auctionId, resultBlock } = curAuction;

//   const parachain = await store.find(Parachain, {
//     where: { id: parachainId },
//     take: 1,
//   });

//   const auction = await store.find(Auction, {
//     where: { id: auctionId },
//     take: 1,
//   });

//   await getOrUpdate(
//     store,
//     ParachainLeases,
//     `${paraId}-${auctionId || "sudo"}-${firstLease}-${lastLease}`,
//     {
//       paraId,
//       parachain: parachain[0],
//       leaseRange: `${auctionId || "sudo"}-${firstLease}-${lastLease}`,
//       firstLease: firstLease.toNumber(),
//       lastLease,
//       latestBidAmount: BigInt(totalUsed),
//       auction: auction[0],
//       activeForAuction: auctionId || "sudo",
//       parachainId,
//       extraAmount: BigInt(extraAmount),
//       winningAmount: BigInt(totalUsed),
//       wonBidFrom: from.toString(),
//       winningResultBlock: resultBlock,
//       hasWon: true,
//     }
//   ).catch((err) => {
//     console.error(`Upsert ParachainLeases failed ${err}`);
//   });
// };

// export const handleNewLeasePeriod = async ({
//   store,
//   event,
//   block,
// }: EventContext & StoreContext): Promise<void> => {
//   const [leaseIdx] = new Slots.NewLeasePeriodEvent(event).params;
//   leasePeriod = leasePeriod || (await getLeasePeriod(block.hash));
//   const timestamp: number = Math.round(block.timestamp / 1000);
//   let newValue = {
//     curLease: leaseIdx.toNumber(),
//     curLeaseStart: timestamp,
//     curLeaseEnd: timestamp + leasePeriod - 1,
//   };

//   await getOrUpdate(store, Chronicle, CHRONICLE_KEY, newValue);
// };
