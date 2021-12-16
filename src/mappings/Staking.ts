import { EventContext, StoreContext } from "@subsquid/hydra-common";
import { getBalance } from ".";
import { Staking } from "../types";

export async function handleBonded({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  const [stash, amount] = new Staking.BondedEvent(event).params;

  let address = stash.toString();
  let amountBalance = amount.toBigInt();
  let balance = await getBalance(address, "Staking Bonded", store, block, true);
  balance.bondedBalance = balance.bondedBalance || 0n + amountBalance;
  await store.save(balance);
}

export async function handleUnBonded({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> {
  const [stash, amount] = new Staking.UnbondedEvent(event).params;

  let address = stash.toString();
  let amountBalance = amount.toBigInt();
  let balance = await getBalance(
    address,
    "Staking UnBonded",
    store,
    block,
    true
  );
  balance.bondedBalance = balance.bondedBalance || 0n - amountBalance;
  await store.save(balance);
}
