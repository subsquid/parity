import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { EXTRINSIC_FAILED } from "../../../constants";
import { handleTransfer } from "./transfer";
import { handleForceTransfer } from "./force_transfer";
import { handleTransferKeepAlive } from "./transfer_keep_alive";
import { handleTransferAll } from "./transfer_all";

enum Calls {
  transfer = "balances.transfer",
  force_transfer = "balances.force_transfer",
  transfer_keep_alive = "balances.transfer_keep_alive",
  transfer_all = "balances.transfer_all",
}

export const addBalancesCallsHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addExtrinsicHandler(
    Calls.transfer,
    { triggerEvents: [EXTRINSIC_FAILED] },
    handleTransfer
  );
  processor.addExtrinsicHandler(
    Calls.force_transfer,
    { triggerEvents: [EXTRINSIC_FAILED] },
    handleForceTransfer
  );
  processor.addExtrinsicHandler(
    Calls.transfer_keep_alive,
    { triggerEvents: [EXTRINSIC_FAILED] },
    handleTransferKeepAlive
  );
  processor.addExtrinsicHandler(
    Calls.transfer_all,
    { triggerEvents: [EXTRINSIC_FAILED] },
    handleTransferAll
  );
};
