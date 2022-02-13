import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { AuctionsBidAcceptedEvent } from "../../types/events";
import { AccountAddress } from "../../customTypes";
import { toKusamaFormat } from "../../utils/addressConvertor";
import {
  createOrUpdateParachain,
  getCrowdloan,
  getIsCrowdloanAddress,
  getLatestCrowdloanId,
  storeAccountAndUpdateBalances,
} from "../../useCases";
import { timestampToDate } from "../../utils/common";
import { createOrUpdateBid } from "../../useCases/bid";
import {
  createOrUpdateAuctionParachain,
  getAuctionParachain,
} from "../../useCases/auctionParachain";
import { getChronicle } from "../../useCases/cronicle";
import { NotFoundError } from "../../utils/errors";

type EventType = {
  accountId: AccountAddress;
  paraId: number;
  amount: bigint;
  firstSlot: number;
  lastSlot: number;
};
/**
 *
 * @param substrateEvent SubstrateEvent
 * Create Bid record and create auction parachain record if not exists already
 * Skip winning bid before we have query abilities
 */
export const bidAcceptedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { accountId, paraId, amount, firstSlot, lastSlot } = getEvent(ctx);

  // todo; Check, it may be needed to use Chronicle; Or this call may be used instead of Chronicle.currentAuction
  const chronicle = await getChronicle(store);
  const auction = chronicle?.currentAuction;

  if (!auction) {
    throw new NotFoundError("Auction", { blockHeight: block.height });
  }

  const auctionId = auction.id;
  const isCrowdloan = await getIsCrowdloanAddress(accountId);
  const parachain = await createOrUpdateParachain(store, paraId, block);

  const crowdloanId = await getLatestCrowdloanId(store, +parachain.id, block);
  await createOrUpdateBid(store, {
    id: `${block.height}-${accountId}-${paraId}-${firstSlot}-${lastSlot}`,
    auction,
    blockNum: block.height,
    winningAuction: auction,
    parachain,
    isCrowdloan,
    amount,
    firstSlot,
    lastSlot,
    createdAt: timestampToDate(block),
    fund: isCrowdloan ? await getCrowdloan(store, crowdloanId) : null,
    bidder: isCrowdloan ? null : accountId,
  });
  // todo; Check if needed to be implemented
  // await markParachainLeases(auctionId, paraId, firstSlot, lastSlot, bidAmount);
  // await markLosingBids(auctionId, firstSlot, lastSlot, bid.id);

  const auctionParachainId = `${paraId}-${firstSlot}-${lastSlot}-${auctionId}`;
  const auctionParachain = await getAuctionParachain(store, auctionParachainId);

  if (!auctionParachain) {
    await createOrUpdateAuctionParachain(store, {
      id: auctionParachainId,
      parachain,
      auction,
      firstSlot,
      lastSlot,
      createdAt: timestampToDate(block),
      blockNum: block.height,
    });
  }
  await storeAccountAndUpdateBalances(store, block, [accountId]);
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new AuctionsBidAcceptedEvent(ctx);

  if (event.isV9010) {
    const [accountId, paraId, amount, firstSlot, lastSlot] = event.asV9010;
    return {
      accountId: toKusamaFormat(accountId),
      paraId,
      amount,
      firstSlot,
      lastSlot,
    };
  }
  const [accountId, paraId, amount, firstSlot, lastSlot] = event.asLatest;
  return {
    accountId: toKusamaFormat(accountId),
    paraId,
    amount,
    firstSlot,
    lastSlot,
  };
};
/*

const markLosingBids = async (
  auctionId: number,
  slotStart: number,
  slotEnd: number,
  winningBidId: string
) => {
  const winningBids = (await Bid.getByWinningAuction(auctionId)) || [];
  const losingBids = winningBids.filter(
    ({ firstSlot, lastSlot, id }) =>
      id !== winningBidId && slotStart == firstSlot && slotEnd == lastSlot
  );
  for (const bid of losingBids) {
    bid.winningAuction = null;
    await bid.save();
    logger.info(`Mark Bid as losing bid ${bid.id}`);
  }
};

const markParachainLeases = async (
  auctionId: number,
  paraId: number,
  leaseStart: number,
  leaseEnd: number,
  bidAmount: bigint
) => {
  const leaseRange = `${auctionId}-${leaseStart}-${leaseEnd}`;
  const { id: parachainId } = await Storage.ensureParachain(paraId);
  const winningLeases =
    (await ParachainLeases.getByLeaseRange(leaseRange)) || [];
  const losingLeases = winningLeases.filter((lease) => lease.paraId !== paraId);
  for (const lease of losingLeases) {
    lease.activeForAuction = null;
    await lease.save();
    logger.info(
      `Mark losing parachain leases ${lease.paraId} for ${lease.leaseRange}`
    );
  }

  const parachainLease = await ParachainLeases.create({});
  parachainLease.id = `${paraId}-${leaseRange}`;
  parachainLease.paraId = paraId;
  parachainLease.leaseRange = leaseRange;
  parachainLease.parachainId = parachainId;
  parachainLease.firstLease = leaseStart;
  parachainLease.lastLease = leaseEnd;
  parachainLease.auctionId = auctionId?.toString();
  parachainLease.latestBidAmount = BigInt(bidAmount);
  parachainLease.activeForAuction = auctionId?.toString();
  parachainLease.hasWon = false;

  await parachainLease.save();
};
*/
