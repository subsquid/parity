import {
  EventHandler,
  EventHandlerContext,
  Store,
  SubstrateBlock,
} from "@subsquid/substrate-processor";
import { AuctionsBidAcceptedEvent } from "../../types/events";
import {
  Auction,
  AuctionParachain,
  Bid,
  Chains,
  Crowdloan,
  ParachainLeases,
} from "../../model";
import { apiService } from "../utils/api";
import {
  ensureParachain,
  getLatestCrowdloanId,
  isFundAddress,
} from "../utils/common";
import { getOrUpdate, toKusamaFormat } from "../utils/utils";

type EventType = {
  from: string;
  paraId: number;
  amount: bigint;
  firstSlot: number;
  lastSlot: number;
};

export const bidAcceptedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { from, paraId, amount, firstSlot, lastSlot } = getEvent(ctx);

  const api = await apiService(block.hash);
  const blockNum = block.height;

  const auctionId = (
    await api.query.auctions.auctionCounter()
  ).toJSON() as number;
  const isFund = await isFundAddress(from);
  const parachain = await ensureParachain(paraId, store, block);
  const { id: parachainId } = parachain;

  const fundId = await getLatestCrowdloanId(parachainId, store, block);
  const auction = await store.find(Auction, {
    where: { id: auctionId.toString() },
  });
  const crowdloan = await store.find(Crowdloan, {
    where: { id: fundId },
  });

  const bid = new Bid({
    id: `${blockNum}-${from}-${paraId}-${firstSlot}-${lastSlot}`,
    auction: auction[0],
    blockNum,
    winningAuction: auctionId,
    parachain,
    isCrowdloan: isFund,
    amount,
    firstSlot,
    lastSlot,
    timestamp: new Date(block.timestamp),
    fund: isFund ? crowdloan[0] : null,
    bidder: isFund ? null : from,
  });

  await store.save(bid);

  await markParachainLeases(
    auctionId,
    paraId,
    firstSlot,
    lastSlot,
    amount,
    store,
    block
  );

  await markLosingBids(auctionId, firstSlot, lastSlot, bid.id, store);

  const auctionParaId = `${paraId}-${firstSlot}-${lastSlot}-${auctionId}`;
  const auctionPara = await store.find(AuctionParachain, {
    where: { id: auctionParaId },
  });
  if (!auctionPara.length) {
    const newAuctionPara = new AuctionParachain({
      id: `${paraId}-${firstSlot}-${lastSlot}-${auctionId}`,
      parachain: (
        await store.find(Chains, {
          where: { id: parachainId },
        })
      )[0],
      auction: (
        await store.find(Auction, {
          where: { id: auctionId.toString() },
        })
      )[0],
      firstSlot,
      lastSlot,
      timestamp: new Date(block.timestamp),
      blockNum,
    });
    await store.save(newAuctionPara);
  }
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new AuctionsBidAcceptedEvent(ctx);
  const [from, paraId, amount, firstSlot, lastSlot] = event.asLatest;
  return { from: toKusamaFormat(from), paraId, amount, firstSlot, lastSlot };
};

const markLosingBids = async (
  auctionId: number,
  slotStart: number,
  slotEnd: number,
  winningBidId: string,
  store: Store
) => {
  const winningBids = await store.find(Bid, {
    where: { winningAuction: auctionId },
  });
  const losingBids =
    winningBids?.filter(
      ({ firstSlot, lastSlot, id }) =>
        id !== winningBidId && slotStart === firstSlot && slotEnd === lastSlot
    ) || [];
  for (const bid of losingBids) {
    bid.winningAuction = null;
    await store.save(bid);
  }
};

const markParachainLeases = async (
  auctionId: number,
  paraId: number,
  leaseStart: number,
  leaseEnd: number,
  bidAmount: bigint,
  store: Store,
  block: SubstrateBlock
) => {
  const leaseRange = `${auctionId}-${leaseStart}-${leaseEnd}`;
  const { id: parachainId } = await ensureParachain(paraId, store, block);
  const winningLeases = await store.find(ParachainLeases, {
    where: { leaseRange },
  });
  const losingLeases =
    winningLeases?.filter((lease) => lease.paraId !== paraId) || [];
  for (const lease of losingLeases) {
    lease.activeForAuction = null;
    await store.save(lease);
    console.info(
      `Mark losing parachain leases ${lease.paraId} for ${lease.leaseRange}`
    );
  }
  const parachain = await store.find(Chains, {
    where: { id: parachainId },
  });

  // TODO: Check schema and remove some redundant fields
  await getOrUpdate(store, ParachainLeases, `${paraId}-${leaseRange}`, {
    paraId,
    leaseRange,
    parachain: parachain[0],
    firstLease: leaseStart,
    lastLease: leaseEnd,
    leaseExpiredBlock: block.height,
    leaseStart,
    leaseEnd,
    auctionId: auctionId?.toString(),
    latestBidAmount: bidAmount,
    activeForAuction: auctionId?.toString(),
    hasWon: false,
    won: false,
  });
};
