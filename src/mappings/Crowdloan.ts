import { EventContext, StoreContext } from "@subsquid/hydra-common";
import { ensureFund, ensureParachain, get } from "./helpers/common";
import { parseNumber, getParachainId } from "./helpers/utils";
import {
  Contribution,
  Parachain,
  Crowdloan as CrowdloanModel,
} from "../generated/model";
import { CROWDLOAN_STATUS } from "../constants";
import { Crowdloan } from "../types";

export const handleCrowdloanCreated = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const [fundId] = new Crowdloan.CreatedEvent(event).params;
  await ensureParachain(fundId.toNumber(), store, block);
  await ensureFund(fundId.toNumber(), store, block, { blockNum: block.height });
};

export const handleCrowdloanContributed = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const blockNum = block.height;
  const [contributorId, fundIdx, amount] = new Crowdloan.ContributedEvent(event)
    .params;
  const parachain = await ensureParachain(fundIdx.toNumber(), store, block);

  const fund = await ensureFund(fundIdx.toNumber(), store, block);
  const fundId = fund.id;
  const crowdLoan = await get(store, CrowdloanModel, fundId);

  if (crowdLoan) {
    const contribution = new Contribution({
      id: `${blockNum}-${event.id}`,
      account: contributorId.toString(),
      parachain,
      crowdloanId: crowdLoan?.id,
      fund: crowdLoan,
      amount: amount.toBigInt(),
      createdAt: new Date(block.timestamp),
      blockNum,
    });

    await store.save(contribution);
  }
};

export const handleCrowdloanDissolved = async ({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> => {
  const { timestamp: createdAt } = block;
  const blockNum = block.height;
  const [fundId] = new Crowdloan.DissolvedEvent(event).params;
  await ensureFund(fundId.toNumber(), store, block, {
    status: CROWDLOAN_STATUS.DISSOLVED,
    isFinished: true,
    updatedAt: new Date(createdAt),
    dissolvedBlock: blockNum,
  });
};
