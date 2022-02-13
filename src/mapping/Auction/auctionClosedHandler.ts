import { EventHandler } from "@subsquid/substrate-processor";
import { getChronicle, updateChronicle } from "../../useCases/cronicle";
import { createOrUpdateAuction } from "../../useCases/auction";
import { AuctionStatus } from "../../constants";
import { NotFoundError } from "../../utils/errors";

export const auctionClosedHandler: EventHandler = async (
  ctx
): Promise<void> => {
  const { store } = ctx;

  const chronicle = await getChronicle(store);
  if (!chronicle?.currentAuction) {
    throw new NotFoundError("Chronicle");
  }

  await createOrUpdateAuction(store, {
    id: chronicle.currentAuction.id,
    ongoing: false,
    status: AuctionStatus.Closed,
  });

  await updateChronicle(store, {
    currentAuction: null,
  });
};
