import { SubstrateProcessor } from "@subsquid/substrate-processor";
import { bidHandler } from "./bid";
import { vouchHandler } from "./vouch";
import { autoUnbidHandler } from "./autoUnbid";
import { unbidHandler } from "./unbid";
import { unvouchHandler } from "./unvouch";
import { voteHandler } from "./vote";
import { defenderVoteHandler } from "./defenderVote";

enum SocietyEvents {
  Bid = "society.Bid",
  Vouch = "society.Vouch",
  AutoUnbid = "society.AutoUnbid",
  Unbid = "society.Unbid",
  Unvouch = "society.Unvouch",
  Vote = "society.Vote",
  DefenderVote = "society.DefenderVote",
}

export const addSocietyEventsHandlers = (
  processor: SubstrateProcessor
): void => {
  processor.addEventHandler(SocietyEvents.Bid, bidHandler);
  processor.addEventHandler(SocietyEvents.Vouch, vouchHandler);
  processor.addEventHandler(SocietyEvents.AutoUnbid, autoUnbidHandler);
  processor.addEventHandler(SocietyEvents.Unbid, unbidHandler);
  processor.addEventHandler(SocietyEvents.Unvouch, unvouchHandler);
  processor.addEventHandler(SocietyEvents.Vote, voteHandler);
  processor.addEventHandler(SocietyEvents.DefenderVote, defenderVoteHandler);
};
