import { EventContext, StoreContext } from "@subsquid/hydra-common";
import { getBalance } from "./Balances";
import { Vesting } from "../types/Vesting";

export async function handleVestingUpdated({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  const [account, vestingBalance] = new Vesting.VestingUpdatedEvent(event)
    .params;

  let address = account.toString();
  let balance = await getBalance(
    address,
    "Vesting Updated",
    store,
    block,
    true
  );
  balance.vestedBalance = vestingBalance.toBigInt();
  await store.save(balance);
}

export async function handleVestingCompleted({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> {
  const [account] = new Vesting.VestingCompletedEvent(event).params;

  let address = account.toString();
  let balance = await getBalance(
    address,
    "Vesting Completed",
    store,
    block,
    true
  );
  balance.vestedBalance = 0n;
  await store.save(balance);
}
