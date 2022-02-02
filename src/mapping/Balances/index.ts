import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { balanceSetHandler } from "./balanceSetHandler";
import { transferHandler } from "./transferHandler";
import { depositHandler } from "./depositHandler";
import { dustLostHandler } from "./dustLosthandler";
import { newAccountHandler } from "./newAccountHandler";
import { reservedHandler } from "./reservedHandler";
import { reserveRepatriatedHandler } from "./reserveRepatriatedHandler";
import { slashedHandler } from "./slashedHandler";
import { unreservedHandler } from "./unreservedHandler";
import { withdrawHandler } from "./withdrawHandler";
import { endowedHandler } from "./endowedHandler";

enum BalancesEvents {
  BalanceSet = "balances.BalanceSet",
  Deposit = "balances.Deposit",
  DustLost = "balances.DustLost",
  Endowed = "balances.Endowed",
  NewAccount = "balances.NewAccount", // missed here
  Reserved = "balances.Reserved",
  ReserveRepatriated = "balances.ReserveRepatriated",
  Slashed = "balances.Slashed",
  Transfer = "balances.Transfer",
  Unreserved = "balances.Unreserved",
  Withdraw = "balances.Withdraw",
}

export const addBalancesEventHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(BalancesEvents.BalanceSet, balanceSetHandler);
  processor.addEventHandler(BalancesEvents.Deposit, depositHandler);
  processor.addEventHandler(BalancesEvents.DustLost, dustLostHandler);
  processor.addEventHandler(BalancesEvents.Endowed, endowedHandler);
  processor.addEventHandler(BalancesEvents.NewAccount, newAccountHandler);
  processor.addEventHandler(BalancesEvents.Reserved, reservedHandler);
  processor.addEventHandler(
    BalancesEvents.ReserveRepatriated,
    reserveRepatriatedHandler
  );
  processor.addEventHandler(BalancesEvents.Slashed, slashedHandler);
  processor.addEventHandler(BalancesEvents.Transfer, transferHandler);
  processor.addEventHandler(BalancesEvents.Unreserved, unreservedHandler);
  processor.addEventHandler(BalancesEvents.Withdraw, withdrawHandler);
};
