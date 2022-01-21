import {
  EventHandler,
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { getRepository } from "typeorm";
import { SlotsLeasedEvent } from "../../types/events";
import { CrowdloanStatus, IGNORE_PARACHAIN_IDS } from "../../constants";
import { ensureFund, ensureParachain, isFundAddress } from "../utils/common";
import { getOrUpdate, parseNumber, toKusamaFormat } from "../utils/utils";
import { Auction, Chains, ParachainLeases } from "../../model";

type EventType = {
  paraId: number;
  from: string;
  firstLease: number;
  leaseCount: number;
  extra: bigint;
  total: bigint;
};

export const leasedHandler: EventHandler = async (ctx): Promise<void> => {
  const { store, block } = ctx;
  const { paraId, from, firstLease, leaseCount, extra, total } = getEvent(ctx);

  const blockNum = block.height;

  const lastLease = firstLease + leaseCount - 1;

  if (IGNORE_PARACHAIN_IDS.includes(paraId)) {
    console.info(`Ignore testing parachain ${paraId}`);
    return;
  }

  const { id: parachainId } = await ensureParachain(paraId, store, block);
  const totalUsed = parseNumber(total.toString());
  const extraAmount = parseNumber(extra.toString());

  const lastAuction = await getRepository(Auction).findOne({
    order: {
      createdAt: "DESC",
    },
  });

  const [ongoingAuction] = await store.find(Auction, {
    where: { ongoing: true },
    take: 1,
  });

  const curAuction = ongoingAuction || {
    id: "unknown",
    resultBlock: blockNum,
    leaseEnd: null,
  };

  if (curAuction.id === "unknown") {
    console.info(
      "No active auction found, sudo or system parachain, upsert unknown Auction"
    );
    await getOrUpdate(store, Auction, "unknown", {
      id: "unknown",
      blockNum,
      status: "Closed",
      slotsStart: 0,
      slotsEnd: 0,
      closingStart: 0,
      closingEnd: 0,
      ongoing: false,
      createdAt: lastAuction?.createdAt ?? new Date(),
    });
  }

  const fundAddress = await isFundAddress(from);
  console.info(
    `handleSlotsLeased isFundAddress - from: ${from} - ${fundAddress.toString()}`
  );

  if (fundAddress) {
    console.info(
      `handleSlotsLeased update - parachain ${paraId} from Started to Won status`
    );
    await ensureFund(paraId, store, block, {
      status: CrowdloanStatus.WON,
      wonAuctionId: curAuction.id,
      leaseExpiredBlock: curAuction.leaseEnd,
    }).catch((err: Error) => {
      console.error(`Upsert Crowdloan failed ${err.toString()}`);
    });
  }

  const { id: auctionId, resultBlock } = curAuction;

  const parachain = await store.find(Chains, {
    where: { id: parachainId },
    take: 1,
  });

  const auction = await store.find(Auction, {
    where: { id: auctionId },
    take: 1,
  });

  console.info(
    `Resolved auction id ${curAuction.id}, resultBlock: ${curAuction.id}, ${
      resultBlock?.toString() || "empty_block_identifier"
    }`
  );

  await getOrUpdate(
    store,
    ParachainLeases,
    `${paraId}-${auctionId || "sudo"}-${firstLease}-${lastLease}`,
    {
      // id: `${paraId}-${firstLease}-${lastLease}-${auctionId || "sudo"}`,
      paraId,
      parachain: parachain[0],
      leaseRange: `${auctionId || "sudo"}-${firstLease}-${lastLease}`,
      firstLease,
      lastLease,
      latestBidAmount: BigInt(totalUsed),
      auction: auction[0],
      activeForAuction: auctionId || "sudo",
      parachainId,
      extraAmount: BigInt(extraAmount),
      winningAmount: BigInt(totalUsed),
      wonBidFrom: from,
      winningResultBlock: resultBlock,
      hasWon: true,
    }
  ).catch((err: Error) => {
    console.error(`Upsert ParachainLeases failed ${err.toString()}`);
  });
};

const getEvent = (ctx: EventHandlerContext): EventType => {
  const event = new SlotsLeasedEvent(ctx);

  const [paraId, from, firstLease, leaseCount, extra, total] = event.asLatest;
  return {
    paraId,
    from: toKusamaFormat(from),
    firstLease,
    leaseCount,
    extra,
    total,
  };
};
