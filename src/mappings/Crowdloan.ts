import { EventContext, StoreContext } from "@subsquid/hydra-common";
import { ensureFund, ensureParachain, get } from "./helpers/common";
import { parseNumber, getParachainId } from "./helpers/utils";
import { Contribution, Parachain, Crowdloan as CrowdloanModel } from "../generated/model";
import { CrowdloanStatus } from "../constants";
import { Crowdloan } from "../types";

export async function handleCrowdloanCreated({
  store,
  event,
  block
}: EventContext & StoreContext): Promise<void> {
  console.info(` ------ [Crowdloan] [Created] Event Started.`);

  const [fundId] = new Crowdloan.CreatedEvent(event).params;
  await ensureParachain(fundId.toNumber(), store, block);
  await ensureFund(fundId.toNumber(), store, block, { blockNum: block.height });

  console.info(` ------ [Crowdloan] [Created] Event Completed.`);
};

export async function handleCrowdloanContributed({
  store,
  event,
  block
}: EventContext & StoreContext): Promise<void> {
  console.info(` ------ [Crowdloan] [Contributed] Event Started.`);

  const blockNum = block.height;
  const [contributorId, fundIdx, amount] = new Crowdloan.ContributedEvent(event).params;
  const parachain = await ensureParachain(fundIdx.toNumber(), store, block);

  const fund = await ensureFund(fundIdx.toNumber(), store, block);
  const fundId = fund.id
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
      blockNum
    });

    await store.save(contribution);

    console.info(` ------ [Crowdloan] [Contributed] Event Completed.`);
  }
}

export async function handleCrowdloanDissolved({
  store,
  event,
  block
}: EventContext & StoreContext): Promise<void> {
  console.info(` ------ [Crowdloan] [Dissolved] Event Started.`);

  const { timestamp: createdAt } = block;
  const blockNum = block.height;
  const [fundId] = new Crowdloan.DissolvedEvent(event).params;
  await ensureFund(fundId.toNumber(), store, block, {
    status: CrowdloanStatus.DISSOLVED,
    isFinished: true,
    updatedAt: new Date(createdAt),
    dissolvedBlock: blockNum,
  });

  console.info(` ------ [Crowdloan] [Dissolved] Event Completed.`);
}