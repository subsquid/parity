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
  Parachain,
  ParachainLeases,
} from "../generated/model";
import { Auctions } from "../types";
import { apiService } from "./helpers/api";
import { ChronicleKey } from "../constants";
import {
  ensureFund,
  ensureParachain,
  get,
  getByAuctionParachain,
  getByAuctions,
  getLatestCrowdloanId,
  getOrCreate,
  getOrUpdate,
  isFundAddress,
} from "./helpers/common";

let periodData: number[];

const getLeasePeriod = async (hash: string): Promise<number[]> => {
  if (!periodData || periodData.length === 0) {
    const api = await apiService();
    const apiAt = await api.at(hash);
    const endingPeriod =
      (apiAt.consts.auctions?.endingPeriod.toJSON() as number) || -1;
    const leasePeriod =
      (apiAt.consts.slots?.leasePeriod.toJSON() as number) || -1;
    const periods =
      (apiAt.consts.auctions?.leasePeriodsPerSlot.toJSON() as number) || -1;
    periodData = [endingPeriod, leasePeriod, periods];
  }
  return periodData;
};

export const handlerEmpty = async () => {};

export const handleAuctionStarted = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [auctionId, slotStart, auctionEnds] = new Auctions.AuctionStartedEvent(
    event
  ).params;

  periodData =
    !periodData || periodData.length === 0
      ? await getLeasePeriod(block.hash)
      : periodData;

  const auction = await getOrCreate(store, Auction, auctionId.toString());

  auction.blockNum = block.height;
  auction.status = "Started";
  auction.slotsStart = slotStart.toNumber();
  auction.slotsEnd = slotStart.toNumber() + periodData[2] - 1;
  auction.leaseStart = slotStart.toNumber() * periodData[1];
  auction.leaseEnd = (slotStart.toNumber() + periodData[2] - 1) * periodData[1];
  auction.createdAt = new Date(block.timestamp);
  auction.closingStart = auctionEnds.toNumber();
  auction.closingEnd = auctionEnds.toNumber() + periodData[0];
  auction.ongoing = true;
  await store.save(auction);

  const chronicle = await get(store, Chronicle, "ChronicleKey");
  if (!chronicle) {
    console.error("Chronicle not defined. Exiting");
    process.exit(1);
  }
  chronicle.curAuctionId = auctionId.toString();
  await store.save(chronicle);
};

export const handleAuctionClosed = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
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
};

export const handleAuctionWinningOffset = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [auctionId, offsetBlock] = new Auctions.WinningOffsetEvent(event)
    .params;
  const auction = await store.find(Auction, {
    where: { id: auctionId.toString() },
  });
  if (!auction) {
    process.exit(1);
  }

  if (auction.length != 0) {
    let auctionData = auction[0];
    auctionData.resultBlock = auctionData.closingStart + offsetBlock.toNumber();
    await store.save(auctionData);
  }
};

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
    await store.save(lease);
  }
  const parachain = await store.find(Parachain, {
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
 *
 * @param substrateEvent SubstrateEvent
 * Create Bid record and create auction parachain record if not exists already
 * Skip winning bid before we have query abilities
 */
export const handleBidAccepted = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  /**
   * Api changes as per the new AT syntax
   */
  const api = await apiService();
  const apiAt = await api.at(block.hash);
  const auctionId = (
    await apiAt.query.auctions.auctionCounter()
  ).toJSON() as number;

  const blockNum = block.height;
  const [from, paraId, amount, firstSlot, lastSlot] =
    new Auctions.BidAcceptedEvent(event).params;
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
    createdAt: new Date(block.timestamp),
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
    let parachain = await store.find(Parachain, {
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
      createdAt: new Date(block.timestamp),
      blockNum,
    });
    await store.save(newAuctionPara);
  }
};

export const updateBlockNum = async (
  block: SubstrateBlock,
  store: DatabaseManager
) => {
  await getOrUpdate<Chronicle>(store, Chronicle, ChronicleKey, {
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
        where: { id: ChronicleKey },
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
