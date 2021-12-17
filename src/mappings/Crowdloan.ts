import { EventContext, StoreContext } from "@subsquid/hydra-common";
import {
  convertAddressToSubstrate,
  ensureFund,
  ensureParachain,
  get,
  timestampToDate,
} from "./helpers/common";
import {
  Contribution,
  Crowdloan as CrowdloanModel,
  Account,
} from "../generated/model";
import { CROWDLOAN_STATUS } from "../constants";
import { Crowdloan } from "../types";
import { createAccountIfNotPresent } from ".";

export async function handleCrowdloanCreated({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  const [fundId] = new Crowdloan.CreatedEvent(event).params;
  await ensureParachain(fundId.toNumber(), store, block);
  await ensureFund(fundId.toNumber(), store, block, { blockNum: block.height });
}

export async function handleCrowdloanContributed({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  const blockNum = block.height;
  const [contributorId, fundIdx, amount] = new Crowdloan.ContributedEvent(event)
    .params;
  const parachain = await ensureParachain(fundIdx.toNumber(), store, block);

  const fund = await ensureFund(fundIdx.toNumber(), store, block);
  const fundId = fund.id;

  const contributor = await createAccountIfNotPresent(
    convertAddressToSubstrate(contributorId.toString()),
    store,
    block
  );
  if (!contributor) {
    console.error("Contributor not found", contributorId.toString());
    process.exit(0);
  }
  // const parachain = fund.parachain
  const crowdLoan = await get(store, CrowdloanModel, fundId);
  if (crowdLoan) {
    const contribution = new Contribution({
      id: `${blockNum}-${event.id}`,
      crowdloanId: crowdLoan.id,
      account: contributor,
      parachain,
      fund: crowdLoan,
      amount: amount.toBigInt(),
      timestamp: new Date(block.timestamp),
      blockNum,
    });

    await store.save(contribution);
  }
}

export async function handleCrowdloanDissolved({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  const { timestamp: createdAt } = block;
  const blockNum = block.height;
  const [fundId] = new Crowdloan.DissolvedEvent(event).params;
  await ensureFund(fundId.toNumber(), store, block, {
    status: CROWDLOAN_STATUS.DISSOLVED,
    isFinished: true,
    updatedAt: new Date(createdAt),
    dissolvedBlock: blockNum,
    dissolved: true,
    dissolvedDate: timestampToDate(block),
  });
}
