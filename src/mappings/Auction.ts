import {
  DatabaseManager,
  EventContext,
  StoreContext,
  SubstrateBlock,
} from "@subsquid/hydra-common";
import {
  Auction,
  AuctionParachain,
  Bid,
  Chronicle,
  Crowdloan,
  Chains,
  ParachainLeases,
} from "../generated/model";
import { Auctions } from "../types";
import { apiService } from "./helpers/api";
import { CHRONICLE_KEY } from "../constants";
import {
  //   ensureFund,
  ensureParachain,
  get,
  getByAuctionParachain,
  getByAuctions,
  getLatestCrowdloanId,
  getOrCreate,
  getOrUpdate,
  isFundAddress,
} from "./helpers/common";

export async function handlerEmpty() {}

export async function handleAuctionStarted({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  console.info(` ------ [Auctions] [AuctionStarted] Event Started.`);

  const [auctionId, slotStart, auctionEnds] = new Auctions.AuctionStartedEvent(
    event
  ).params;

  const api = await apiService(block.hash);
  const endingPeriod = api.consts.auctions.endingPeriod.toJSON() as number;
  const leasePeriod = api.consts.slots.leasePeriod.toJSON() as number;
  const periods = api.consts.auctions.leasePeriodsPerSlot.toJSON() as number;

  const auction = await getOrCreate(store, Auction, auctionId.toString());

  auction.blockNum = block.height;
  auction.status = "Started";
  auction.slotsStart = slotStart.toNumber();
  auction.slotsEnd = slotStart.toNumber() + periods - 1;
  auction.leaseStart = slotStart.toNumber() * leasePeriod;
  auction.leaseEnd = (slotStart.toNumber() + periods - 1) * leasePeriod;
  auction.createdAt = new Date(block.timestamp);
  auction.closingStart = auctionEnds.toNumber();
  auction.closingEnd = auctionEnds.toNumber() + endingPeriod;
  auction.ongoing = true;
  await store.save(auction);

  const chronicle = await get(store, Chronicle, "ChronicleKey");
  if (!chronicle) {
    console.error("Chronicle not defined. Exiting");
    process.exit(1);
  }
  chronicle.curAuctionId = auctionId.toString();
  await store.save(chronicle);

  console.info(` ------ [Auctions] [AuctionStarted] Event Completed.`);
}

export async function handleAuctionClosed({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  console.info(` ------ [Auctions] [AuctionClosed] Event Started.`);

  const [auctionId] = new Auctions.AuctionClosedEvent(event).params;
  const auction = await get(store, Auction, auctionId.toString());
  if (!auction) {
    console.error("Auction not defined. Exiting");
    process.exit(1);
  }

  auction.blockNum = block.height;
  auction.status = "Closed";
  auction.ongoing = false;

  await store.save(auction);

  const chronicle = await get(store, Chronicle, "ChronicleKey");
  if (!chronicle) {
    console.error("Chronicle not defined. Exiting");
    process.exit(1);
  }
  chronicle.curAuctionId = null;
  await store.save(chronicle);

  console.info(` ------ [Auctions] [AuctionClosed] Event Completed.`);
}

export async function handleAuctionWinningOffset({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  console.info(` ------ [Auctions] [WinningOffset] Event Started.`);

  const [auctionId, offsetBlock] = new Auctions.WinningOffsetEvent(event)
    .params;
  const auction = await store.find(Auction, {
    where: { id: auctionId.toString() },
  });
  if (!auction) {
    console.log("Auction not defined for handleAuctionWinningOffset");
    process.exit(1);
  }

  if (auction.length != 0) {
    let auctionData = auction[0];
    auctionData.resultBlock = auctionData.closingStart + offsetBlock.toNumber();
    console.info(
      `Update auction ${auctionId} winning offset: ${auctionData.resultBlock}`
    );
    await store.save(auctionData);
  }

  console.info(` ------ [Auctions] [WinningOffset] Event Completed.`);
}

const markLosingBids = async (
  auctionId: number,
  slotStart: number,
  slotEnd: number,
  winningBidId: string,
  store: DatabaseManager
) => {
  const winningBids = await store.find(Bid, {
    where: { winningAuction: auctionId },
  });
  const losingBids =
    winningBids?.filter(
      ({ firstSlot, lastSlot, id }) =>
        id !== winningBidId && slotStart == firstSlot && slotEnd == lastSlot
    ) || [];
  for (const bid of losingBids) {
    bid.winningAuction = null;
    await store.save(bid);
    console.info(`Mark Bid as losing bid ${bid.id}`);
  }
};

const markParachainLeases = async (
  auctionId: number,
  paraId: number,
  leaseStart: number,
  leaseEnd: number,
  bidAmount: bigint,
  store: DatabaseManager,
  block: SubstrateBlock
) => {
  const leaseRange = `${auctionId}-${leaseStart}-${leaseEnd}`;
  const { id: parachainId } = await ensureParachain(paraId, store, block);
  const winningLeases = await store.find(ParachainLeases, {
    where: { leaseRange: leaseRange },
  });
  const losingLeases =
    winningLeases?.filter((lease) => lease.paraId !== paraId) || [];
  for (const lease of losingLeases) {
    lease.activeForAuction = null;
    store.save(lease);
    console.info(
      `Mark losing parachain leases ${lease.paraId} for ${lease.leaseRange}`
    );
  }
  const parachain = await store.find(Chains, {
    where: { id: parachainId },
  });
  await getOrUpdate(store, ParachainLeases, `${paraId}-${leaseRange}`, {
    paraId,
    leaseRange,
    parachain: parachain[0],
    firstLease: leaseStart,
    lastLease: leaseEnd,
    auctionId: auctionId?.toString(),
    latestBidAmount: bidAmount,
    activeForAuction: auctionId?.toString(),
    hasWon: false,
  });
};

/**
 * Create Bid record and create auction parachain record if not exists already
 * Skip winning bid before we have query abilities
 * @param substrateEvent SubstrateEvent
 */
export const handleBidAccepted = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const api = await apiService();
  const blockNum = block.height;
  const [from, paraId, amount, firstSlot, lastSlot] =
    new Auctions.BidAcceptedEvent(event).params;
  const auctionId = (
    await api.query.auctions.auctionCounter.at(block.hash)
  ).toJSON() as number;
  const isFund = await isFundAddress(from.toString());
  const parachain = await ensureParachain(paraId.toNumber(), store, block);
  const { id: parachainId } = parachain;

  const fundId = await getLatestCrowdloanId(parachainId, store);
  let auction = await store.find(Auction, {
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
    amount: amount.toBigInt(),
    firstSlot: firstSlot.toNumber(),
    lastSlot: lastSlot.toNumber(),
    timestamp: new Date(block.timestamp),
    fund: isFund ? crowdloan[0] : null,
    bidder: isFund ? null : from.toString(),
  });

  await store.save(bid);

  await markParachainLeases(
    auctionId,
    paraId.toNumber(),
    firstSlot.toNumber(),
    lastSlot.toNumber(),
    amount.toBigInt(),
    store,
    block
  );

  await markLosingBids(
    auctionId,
    firstSlot.toNumber(),
    lastSlot.toNumber(),
    bid.id,
    store
  );

  const auctionParaId = `${paraId}-${firstSlot}-${lastSlot}-${auctionId}`;
  const auctionPara = await store.find(AuctionParachain, {
    where: { id: auctionParaId },
  });
  if (auctionPara.length == 0) {
    let parachain = await store.find(Chains, {
      where: { id: parachainId },
    });
    let auction = await store.find(Auction, {
      where: { id: auctionId.toString() },
    });
    let newAuctionPara = new AuctionParachain({
      id: `${paraId}-${firstSlot}-${lastSlot}-${auctionId}`,
      parachain: parachain[0],
      auction: auction[0],
      firstSlot: firstSlot.toNumber(),
      lastSlot: lastSlot.toNumber(),
      timestamp: new Date(block.timestamp),
      blockNum,
    });
    await store.save(newAuctionPara);
  }
};

export const updateBlockNum = async (
  block: SubstrateBlock,
  store: DatabaseManager
) => {
  await getOrUpdate<Chronicle>(store, Chronicle, CHRONICLE_KEY, {
    curBlockNum: block.height,
  });
};

export const updateWinningBlocks = async (
  block: SubstrateBlock,
  store: DatabaseManager
) => {
  const { curAuctionId, curBlockNum } =
    (
      await store.find(Chronicle, {
        where: { id: CHRONICLE_KEY },
      })
    )[0] || {};
  const { closingStart, closingEnd } =
    (
      await store.find(Auction, {
        where: { id: curAuctionId || "" },
      })
    )[0] || {};
  let currentBlockNumber = curBlockNum || -1;
  if (
    curAuctionId &&
    currentBlockNumber >= closingStart &&
    currentBlockNumber < closingEnd
  ) {
    const winningLeases = await store.find(ParachainLeases, {
      where: { id: curAuctionId },
    });
    for (const lease of winningLeases) {
      lease.numBlockWon = (lease.numBlockWon || 0) + 1;
      await store.save(lease);
    }
  }
};
