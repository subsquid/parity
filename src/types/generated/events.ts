import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v2008 from './v2008'
import * as v9122 from './v9122'
import * as v9130 from './v9130'
import * as v9160 from './v9160'

export class AuctionsAuctionClosedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'auctions.AuctionClosed')
  }

  /**
   *  An auction ended. All funds become unreserved. [auction_index]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('auctions.AuctionClosed') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  /**
   *  An auction ended. All funds become unreserved. [auction_index]
   */
  get asV9010(): number {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV9010
  }
}

export class AuctionsAuctionStartedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'auctions.AuctionStarted')
  }

  /**
   *  An auction started. Provides its index and the block number where it will begin to
   *  close and the first lease period of the quadruplet that is auctioned.
   *  [auction_index, lease_period, ending]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('auctions.AuctionStarted') === 'ee14df8652ec18f0202c95706dac25953673d4834fcfe21e7d7559cb96975c06'
  }

  /**
   *  An auction started. Provides its index and the block number where it will begin to
   *  close and the first lease period of the quadruplet that is auctioned.
   *  [auction_index, lease_period, ending]
   */
  get asV9010(): [number, number, number] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): [number, number, number] {
    deprecateLatest()
    return this.asV9010
  }
}

export class AuctionsBidAcceptedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'auctions.BidAccepted')
  }

  /**
   *  A new bid has been accepted as the current winner.
   *  \[who, para_id, amount, first_slot, last_slot\]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('auctions.BidAccepted') === '89884350b7a4ca0c3118205f5dd286d5dc73be6020a05db22ce70b152f4d165e'
  }

  /**
   *  A new bid has been accepted as the current winner.
   *  \[who, para_id, amount, first_slot, last_slot\]
   */
  get asV9010(): [Uint8Array, number, bigint, number, number] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): [Uint8Array, number, bigint, number, number] {
    deprecateLatest()
    return this.asV9010
  }
}

export class AuctionsReserveConfiscatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'auctions.ReserveConfiscated')
  }

  /**
   *  Someone attempted to lease the same slot twice for a parachain. The amount is held in reserve
   *  but no parachain slot has been leased.
   *  \[parachain_id, leaser, amount\]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('auctions.ReserveConfiscated') === '491d5eb10503fbf716b3399d749f1a02c0a60c5f903a500a8ed4f9f98fd07f34'
  }

  /**
   *  Someone attempted to lease the same slot twice for a parachain. The amount is held in reserve
   *  but no parachain slot has been leased.
   *  \[parachain_id, leaser, amount\]
   */
  get asV9010(): [number, Uint8Array, bigint] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): [number, Uint8Array, bigint] {
    deprecateLatest()
    return this.asV9010
  }
}

export class AuctionsReservedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'auctions.Reserved')
  }

  /**
   *  Funds were reserved for a winning bid. First balance is the extra amount reserved.
   *  Second is the total. [bidder, extra_reserved, total_amount]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('auctions.Reserved') === '0f263bfdefa394edfb38d20d33662423a2e0902235b599f9b2b0292f157f0902'
  }

  /**
   *  Funds were reserved for a winning bid. First balance is the extra amount reserved.
   *  Second is the total. [bidder, extra_reserved, total_amount]
   */
  get asV9010(): [Uint8Array, bigint, bigint] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): [Uint8Array, bigint, bigint] {
    deprecateLatest()
    return this.asV9010
  }
}

export class AuctionsUnreservedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'auctions.Unreserved')
  }

  /**
   *  Funds were unreserved since bidder is no longer active. [bidder, amount]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('auctions.Unreserved') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  Funds were unreserved since bidder is no longer active. [bidder, amount]
   */
  get asV9010(): [Uint8Array, bigint] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV9010
  }
}

export class AuctionsWinningOffsetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'auctions.WinningOffset')
  }

  /**
   *  The winning offset was chosen for an auction. This will map into the `Winning` storage map.
   *  \[auction_index, block_number\]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('auctions.WinningOffset') === 'a09602e40984745a7411a1855af06d133893a422fd68f7bdc4fb6a56bf1a3645'
  }

  /**
   *  The winning offset was chosen for an auction. This will map into the `Winning` storage map.
   *  \[auction_index, block_number\]
   */
  get asV9010(): [number, number] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): [number, number] {
    deprecateLatest()
    return this.asV9010
  }
}

export class BalancesBalanceSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.BalanceSet')
  }

  /**
   *  A balance was set by root (who, free, reserved).
   */
  get isV1031(): boolean {
    return this.ctx._chain.getEventHash('balances.BalanceSet') === '0f263bfdefa394edfb38d20d33662423a2e0902235b599f9b2b0292f157f0902'
  }

  /**
   *  A balance was set by root (who, free, reserved).
   */
  get asV1031(): [Uint8Array, bigint, bigint] {
    assert(this.isV1031)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A balance was set by root.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.BalanceSet') === '1e2b5d5a07046e6d6e5507661d3f3feaddfb41fc609a2336b24957322080ca77'
  }

  /**
   * A balance was set by root.
   */
  get asV9130(): {who: v9130.AccountId32, free: bigint, reserved: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {who: v9130.AccountId32, free: bigint, reserved: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class BalancesDepositEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Deposit')
  }

  /**
   *  Some amount was deposited (e.g. for transaction fees).
   */
  get isV1032(): boolean {
    return this.ctx._chain.getEventHash('balances.Deposit') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  Some amount was deposited (e.g. for transaction fees).
   */
  get asV1032(): [Uint8Array, bigint] {
    assert(this.isV1032)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.Deposit') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get asV9130(): {who: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {who: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class BalancesDustLostEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.DustLost')
  }

  /**
   *  An account was removed whose balance was non-zero but below ExistentialDeposit,
   *  resulting in an outright loss.
   */
  get isV1050(): boolean {
    return this.ctx._chain.getEventHash('balances.DustLost') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  An account was removed whose balance was non-zero but below ExistentialDeposit,
   *  resulting in an outright loss.
   */
  get asV1050(): [Uint8Array, bigint] {
    assert(this.isV1050)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.DustLost') === '504f155afb2789c50df19d1f747fb2dc0e99bf8b7623c30bdb5cf82029fec760'
  }

  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss.
   */
  get asV9130(): {account: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {account: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class BalancesEndowedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Endowed')
  }

  /**
   *  An account was created with some free balance.
   */
  get isV1050(): boolean {
    return this.ctx._chain.getEventHash('balances.Endowed') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  An account was created with some free balance.
   */
  get asV1050(): [Uint8Array, bigint] {
    assert(this.isV1050)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * An account was created with some free balance.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.Endowed') === '75951f685df19cbb5fdda09cf928a105518ceca9576d95bd18d4fac8802730ca'
  }

  /**
   * An account was created with some free balance.
   */
  get asV9130(): {account: v9130.AccountId32, freeBalance: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {account: v9130.AccountId32, freeBalance: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class BalancesNewAccountEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.NewAccount')
  }

  /**
   *  A new account was created.
   */
  get isV1020(): boolean {
    return this.ctx._chain.getEventHash('balances.NewAccount') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  A new account was created.
   */
  get asV1020(): [Uint8Array, bigint] {
    assert(this.isV1020)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1020
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1020
  }
}

export class BalancesReserveRepatriatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.ReserveRepatriated')
  }

  /**
   *  Some balance was moved from the reserve of the first account to the second account.
   *  Final argument indicates the destination balance type.
   */
  get isV2008(): boolean {
    return this.ctx._chain.getEventHash('balances.ReserveRepatriated') === '68e9ec5664c8ffe977da0c890bac43122a5cf13565c1c936e2120ba4980bcf31'
  }

  /**
   *  Some balance was moved from the reserve of the first account to the second account.
   *  Final argument indicates the destination balance type.
   */
  get asV2008(): [Uint8Array, Uint8Array, bigint, v2008.BalanceStatus] {
    assert(this.isV2008)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.ReserveRepatriated') === '6232d50d422cea3a6fd21da36387df36d1d366405d0c589566c6de85c9cf541f'
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  get asV9130(): {from: v9130.AccountId32, to: v9130.AccountId32, amount: bigint, destinationStatus: v9130.BalanceStatus} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {from: v9130.AccountId32, to: v9130.AccountId32, amount: bigint, destinationStatus: v9130.BalanceStatus} {
    deprecateLatest()
    return this.asV9130
  }
}

export class BalancesReservedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Reserved')
  }

  /**
   *  Some balance was reserved (moved from free to reserved).
   */
  get isV2008(): boolean {
    return this.ctx._chain.getEventHash('balances.Reserved') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  Some balance was reserved (moved from free to reserved).
   */
  get asV2008(): [Uint8Array, bigint] {
    assert(this.isV2008)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.Reserved') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get asV9130(): {who: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {who: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class BalancesSlashedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Slashed')
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior). \[who,
   * amount_slashed\]
   */
  get isV9122(): boolean {
    return this.ctx._chain.getEventHash('balances.Slashed') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior). \[who,
   * amount_slashed\]
   */
  get asV9122(): [v9122.AccountId32, bigint] {
    assert(this.isV9122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior).
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.Slashed') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior).
   */
  get asV9130(): {who: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {who: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   *  Transfer succeeded (from, to, value, fees).
   */
  get isV1020(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '72e6f0d399a72f77551d560f52df25d757e0643d0192b3bc837cbd91b6f36b27'
  }

  /**
   *  Transfer succeeded (from, to, value, fees).
   */
  get asV1020(): [Uint8Array, Uint8Array, bigint, bigint] {
    assert(this.isV1020)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   *  Transfer succeeded (from, to, value).
   */
  get isV1050(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === 'dad2bcdca357505fa3c7832085d0db53ce6f902bd9f5b52823ee8791d351872c'
  }

  /**
   *  Transfer succeeded (from, to, value).
   */
  get asV1050(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV1050)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Transfer succeeded.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
  }

  /**
   * Transfer succeeded.
   */
  get asV9130(): {from: v9130.AccountId32, to: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {from: v9130.AccountId32, to: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class BalancesUnreservedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Unreserved')
  }

  /**
   *  Some balance was unreserved (moved from reserved to free).
   */
  get isV2008(): boolean {
    return this.ctx._chain.getEventHash('balances.Unreserved') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  Some balance was unreserved (moved from reserved to free).
   */
  get asV2008(): [Uint8Array, bigint] {
    assert(this.isV2008)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Some balance was unreserved (moved from reserved to free).
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.Unreserved') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some balance was unreserved (moved from reserved to free).
   */
  get asV9130(): {who: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {who: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class BalancesWithdrawEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Withdraw')
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees). \[who, value\]
   */
  get isV9122(): boolean {
    return this.ctx._chain.getEventHash('balances.Withdraw') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees). \[who, value\]
   */
  get asV9122(): [v9122.AccountId32, bigint] {
    assert(this.isV9122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.Withdraw') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get asV9130(): {who: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {who: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class BountiesBountyClaimedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'bounties.BountyClaimed')
  }

  /**
   *  A bounty is claimed by beneficiary. \[index, payout, beneficiary\]
   */
  get isV2028(): boolean {
    return this.ctx._chain.getEventHash('bounties.BountyClaimed') === '86708250ac506876b8d63d9c97b4ca0fa73f0199c633da6fb2a8956aaab8c743'
  }

  /**
   *  A bounty is claimed by beneficiary. \[index, payout, beneficiary\]
   */
  get asV2028(): [number, bigint, Uint8Array] {
    assert(this.isV2028)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A bounty is claimed by beneficiary.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('bounties.BountyClaimed') === 'fb4b26ccfabe9f649bfadde9c0bbee0816e9cf32c7384f2f21c03a852ec23f77'
  }

  /**
   * A bounty is claimed by beneficiary.
   */
  get asV9130(): {index: number, payout: bigint, beneficiary: v9130.AccountId32} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {index: number, payout: bigint, beneficiary: v9130.AccountId32} {
    deprecateLatest()
    return this.asV9130
  }
}

export class ClaimsClaimedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'claims.Claimed')
  }

  /**
   *  Someone claimed some DOTs.
   */
  get isV1020(): boolean {
    return this.ctx._chain.getEventHash('claims.Claimed') === '317eeaadc76ca7d763e634bff31da2b98d72376d5e842a0cded1cf421e0694c1'
  }

  /**
   *  Someone claimed some DOTs.
   */
  get asV1020(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV1020)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1020
  }

  get asLatest(): [Uint8Array, Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1020
  }
}

export class CrowdloanContributedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'crowdloan.Contributed')
  }

  /**
   *  Contributed to a crowd sale. [who, fund_index, amount]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('crowdloan.Contributed') === 'ad00729b31f26d2879a6f96c1691ed42a69cd4947c75e84221a6bde93a3415bc'
  }

  /**
   *  Contributed to a crowd sale. [who, fund_index, amount]
   */
  get asV9010(): [Uint8Array, number, bigint] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): [Uint8Array, number, bigint] {
    deprecateLatest()
    return this.asV9010
  }
}

export class CrowdloanCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'crowdloan.Created')
  }

  /**
   *  Create a new crowdloaning campaign. [fund_index]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('crowdloan.Created') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  /**
   *  Create a new crowdloaning campaign. [fund_index]
   */
  get asV9010(): number {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV9010
  }
}

export class CrowdloanDissolvedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'crowdloan.Dissolved')
  }

  /**
   *  Fund is dissolved. [fund_index]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('crowdloan.Dissolved') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  /**
   *  Fund is dissolved. [fund_index]
   */
  get asV9010(): number {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV9010
  }
}

export class DemocracyPreimageNotedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'democracy.PreimageNoted')
  }

  /**
   *  A proposal's preimage was noted, and the deposit taken.
   */
  get isV1022(): boolean {
    return this.ctx._chain.getEventHash('democracy.PreimageNoted') === 'dad2bcdca357505fa3c7832085d0db53ce6f902bd9f5b52823ee8791d351872c'
  }

  /**
   *  A proposal's preimage was noted, and the deposit taken.
   */
  get asV1022(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV1022)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A proposal's preimage was noted, and the deposit taken.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('democracy.PreimageNoted') === 'd070eaca902e57d242e4f2fcf32e1044fe909d807ce0a0303e2bb45499fc9748'
  }

  /**
   * A proposal's preimage was noted, and the deposit taken.
   */
  get asV9130(): {proposalHash: v9130.H256, who: v9130.AccountId32, deposit: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {proposalHash: v9130.H256, who: v9130.AccountId32, deposit: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class DemocracyPreimageReapedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'democracy.PreimageReaped')
  }

  /**
   *  A registered preimage was removed and the deposit collected by the reaper (last item).
   */
  get isV1022(): boolean {
    return this.ctx._chain.getEventHash('democracy.PreimageReaped') === 'b60e8c24758d2dae6f1d75c508a3141a304f756181262747ee8d704bd555ac86'
  }

  /**
   *  A registered preimage was removed and the deposit collected by the reaper (last item).
   */
  get asV1022(): [Uint8Array, Uint8Array, bigint, Uint8Array] {
    assert(this.isV1022)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A registered preimage was removed and the deposit collected by the reaper.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('democracy.PreimageReaped') === '3140454b0dfcc8f9c1ccda6a2fe7f5153f3d34c52e1e5bb1d954b96b8f5dd4a5'
  }

  /**
   * A registered preimage was removed and the deposit collected by the reaper.
   */
  get asV9130(): {proposalHash: v9130.H256, provider: v9130.AccountId32, deposit: bigint, reaper: v9130.AccountId32} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {proposalHash: v9130.H256, provider: v9130.AccountId32, deposit: bigint, reaper: v9130.AccountId32} {
    deprecateLatest()
    return this.asV9130
  }
}

export class DemocracyPreimageUsedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'democracy.PreimageUsed')
  }

  /**
   *  A proposal preimage was removed and used (the deposit was returned).
   */
  get isV1022(): boolean {
    return this.ctx._chain.getEventHash('democracy.PreimageUsed') === 'dad2bcdca357505fa3c7832085d0db53ce6f902bd9f5b52823ee8791d351872c'
  }

  /**
   *  A proposal preimage was removed and used (the deposit was returned).
   */
  get asV1022(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV1022)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A proposal preimage was removed and used (the deposit was returned).
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('democracy.PreimageUsed') === '7b28a71d659ed286affdbc9e835b253b80485e4b3be08d04bfb153f8f8cc5241'
  }

  /**
   * A proposal preimage was removed and used (the deposit was returned).
   */
  get asV9130(): {proposalHash: v9130.H256, provider: v9130.AccountId32, deposit: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {proposalHash: v9130.H256, provider: v9130.AccountId32, deposit: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class DemocracyTabledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'democracy.Tabled')
  }

  get isV1020(): boolean {
    return this.ctx._chain.getEventHash('democracy.Tabled') === '21f3d10122d183ae1df61d3456ae07c362a2e0cdffab1829f4febb4f7b53f6bd'
  }

  get asV1020(): [number, bigint, Uint8Array[]] {
    assert(this.isV1020)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A public proposal has been tabled for referendum vote.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('democracy.Tabled') === 'a13f0b4abdda616a48f0910930f31ca5c2a2a8068c5289a35d395475289bd1e0'
  }

  /**
   * A public proposal has been tabled for referendum vote.
   */
  get asV9130(): {proposalIndex: number, deposit: bigint, depositors: v9130.AccountId32[]} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {proposalIndex: number, deposit: bigint, depositors: v9130.AccountId32[]} {
    deprecateLatest()
    return this.asV9130
  }
}

export class DemocracyVotedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'democracy.Voted')
  }

  /**
   * An account has voted in a referendum
   */
  get isV9160(): boolean {
    return this.ctx._chain.getEventHash('democracy.Voted') === '1f7c6893e642faadc0fb2681a07f3aa74579a935cb93e932ab8fd8a9e9fe739c'
  }

  /**
   * An account has voted in a referendum
   */
  get asV9160(): {voter: v9160.AccountId32, refIndex: number, vote: v9160.AccountVote} {
    assert(this.isV9160)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9160
  }

  get asLatest(): {voter: v9160.AccountId32, refIndex: number, vote: v9160.AccountVote} {
    deprecateLatest()
    return this.asV9160
  }
}

export class GiltBidPlacedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'gilt.BidPlaced')
  }

  /**
   *  A bid was successfully placed.
   *  \[ who, amount, duration \]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('gilt.BidPlaced') === '08cc21c0d68ca514760f97888105328fe1685d191a70eb2254c1c645212a936f'
  }

  /**
   *  A bid was successfully placed.
   *  \[ who, amount, duration \]
   */
  get asV9010(): [Uint8Array, bigint, number] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A bid was successfully placed.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('gilt.BidPlaced') === 'b0947d8bc923fc2ba8237446323e8743314725badadc7ac334aa68f07643660e'
  }

  /**
   * A bid was successfully placed.
   */
  get asV9130(): {who: v9130.AccountId32, amount: bigint, duration: number} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {who: v9130.AccountId32, amount: bigint, duration: number} {
    deprecateLatest()
    return this.asV9130
  }
}

export class GiltBidRetractedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'gilt.BidRetracted')
  }

  /**
   *  A bid was successfully removed (before being accepted as a gilt).
   *  \[ who, amount, duration \]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('gilt.BidRetracted') === '08cc21c0d68ca514760f97888105328fe1685d191a70eb2254c1c645212a936f'
  }

  /**
   *  A bid was successfully removed (before being accepted as a gilt).
   *  \[ who, amount, duration \]
   */
  get asV9010(): [Uint8Array, bigint, number] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A bid was successfully removed (before being accepted as a gilt).
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('gilt.BidRetracted') === 'b0947d8bc923fc2ba8237446323e8743314725badadc7ac334aa68f07643660e'
  }

  /**
   * A bid was successfully removed (before being accepted as a gilt).
   */
  get asV9130(): {who: v9130.AccountId32, amount: bigint, duration: number} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {who: v9130.AccountId32, amount: bigint, duration: number} {
    deprecateLatest()
    return this.asV9130
  }
}

export class GiltGiltIssuedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'gilt.GiltIssued')
  }

  /**
   *  A bid was accepted as a gilt. The balance may not be released until expiry.
   *  \[ index, expiry, who, amount \]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('gilt.GiltIssued') === '97e60976bee393feead863d4db334e2f5008070d4a412ad40b086fbc17a2b3b0'
  }

  /**
   *  A bid was accepted as a gilt. The balance may not be released until expiry.
   *  \[ index, expiry, who, amount \]
   */
  get asV9010(): [number, number, Uint8Array, bigint] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A bid was accepted as a gilt. The balance may not be released until expiry.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('gilt.GiltIssued') === 'ec1cbb54fa1459d43188e9bbc3b223b26154c76f0281cc7d9622206cb75a5c62'
  }

  /**
   * A bid was accepted as a gilt. The balance may not be released until expiry.
   */
  get asV9130(): {index: number, expiry: number, who: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {index: number, expiry: number, who: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class GiltGiltThawedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'gilt.GiltThawed')
  }

  /**
   *  An expired gilt has been thawed.
   *  \[ index, who, original_amount, additional_amount \]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('gilt.GiltThawed') === '509fd6bf05af1312163727733b94afe6ea0234cd120ac7f53d4cf765e8c50e51'
  }

  /**
   *  An expired gilt has been thawed.
   *  \[ index, who, original_amount, additional_amount \]
   */
  get asV9010(): [number, Uint8Array, bigint, bigint] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * An expired gilt has been thawed.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('gilt.GiltThawed') === '4722172baa4d49b3d196e98d87b787a7919032efd393cb88c3db7c84159a3233'
  }

  /**
   * An expired gilt has been thawed.
   */
  get asV9130(): {index: number, who: v9130.AccountId32, originalAmount: bigint, additionalAmount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {index: number, who: v9130.AccountId32, originalAmount: bigint, additionalAmount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class PhragmenElectionCandidateSlashedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'phragmenElection.CandidateSlashed')
  }

  /**
   *  A \[candidate\] was slashed by \[amount\] due to failing to obtain a seat as member or
   *  runner-up.
   * 
   *  Note that old members and runners-up are also candidates.
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('phragmenElection.CandidateSlashed') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  A \[candidate\] was slashed by \[amount\] due to failing to obtain a seat as member or
   *  runner-up.
   * 
   *  Note that old members and runners-up are also candidates.
   */
  get asV9010(): [Uint8Array, bigint] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A candidate was slashed by amount due to failing to obtain a seat as member or
   * runner-up.
   * 
   * Note that old members and runners-up are also candidates.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('phragmenElection.CandidateSlashed') === 'a64270141b7a7c84c0950e5dcd31bc284b27b39505d278ff519f44f855ee33d8'
  }

  /**
   * A candidate was slashed by amount due to failing to obtain a seat as member or
   * runner-up.
   * 
   * Note that old members and runners-up are also candidates.
   */
  get asV9130(): {candidate: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {candidate: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class PhragmenElectionNewTermEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'phragmenElection.NewTerm')
  }

  /**
   *  A new term with \[new_members\]. This indicates that enough candidates existed to run
   *  the election, not that enough have has been elected. The inner value must be examined
   *  for this purpose. A `NewTerm(\[\])` indicates that some candidates got their bond
   *  slashed and none were elected, whilst `EmptyTerm` means that no candidates existed to
   *  begin with.
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('phragmenElection.NewTerm') === 'd7a45cf0fb3b6c39f6db66d04bddff68afaa850200debf915801414eda809fe1'
  }

  /**
   *  A new term with \[new_members\]. This indicates that enough candidates existed to run
   *  the election, not that enough have has been elected. The inner value must be examined
   *  for this purpose. A `NewTerm(\[\])` indicates that some candidates got their bond
   *  slashed and none were elected, whilst `EmptyTerm` means that no candidates existed to
   *  begin with.
   */
  get asV9010(): [Uint8Array, bigint][] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A new term with new_members. This indicates that enough candidates existed to run
   * the election, not that enough have has been elected. The inner value must be examined
   * for this purpose. A `NewTerm(\[\])` indicates that some candidates got their bond
   * slashed and none were elected, whilst `EmptyTerm` means that no candidates existed to
   * begin with.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('phragmenElection.NewTerm') === 'c26c6ac673ee46db2001722c75880df159f382274469750dc468b868c6f738c8'
  }

  /**
   * A new term with new_members. This indicates that enough candidates existed to run
   * the election, not that enough have has been elected. The inner value must be examined
   * for this purpose. A `NewTerm(\[\])` indicates that some candidates got their bond
   * slashed and none were elected, whilst `EmptyTerm` means that no candidates existed to
   * begin with.
   */
  get asV9130(): {newMembers: [v9130.AccountId32, bigint][]} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {newMembers: [v9130.AccountId32, bigint][]} {
    deprecateLatest()
    return this.asV9130
  }
}

export class PhragmenElectionSeatHolderSlashedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'phragmenElection.SeatHolderSlashed')
  }

  /**
   *  A \[seat holder\] was slashed by \[amount\] by being forcefully removed from the set.
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('phragmenElection.SeatHolderSlashed') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  A \[seat holder\] was slashed by \[amount\] by being forcefully removed from the set.
   */
  get asV9010(): [Uint8Array, bigint] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A seat holder was slashed by amount by being forcefully removed from the set.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('phragmenElection.SeatHolderSlashed') === '7a1552e3cb4a3dc87408db4d42391f3a98998bb0e6bf70aa82661919c4d12eaa'
  }

  /**
   * A seat holder was slashed by amount by being forcefully removed from the set.
   */
  get asV9130(): {seatHolder: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {seatHolder: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}

export class RegistrarDeregisteredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'registrar.Deregistered')
  }

  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('registrar.Deregistered') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV9010(): number {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV9010
  }
}

export class RegistrarRegisteredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'registrar.Registered')
  }

  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('registrar.Registered') === '0379562584d6426ccff49705dfa9dba95ad94215b772fd97d0ad0c4ca0001c12'
  }

  get asV9010(): [number, Uint8Array] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): [number, Uint8Array] {
    deprecateLatest()
    return this.asV9010
  }
}

export class SlotsLeasedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'slots.Leased')
  }

  /**
   *  An existing parachain won the right to continue.
   *  First balance is the extra amount reseved. Second is the total amount reserved.
   *  \[parachain_id, leaser, period_begin, period_count, extra_reseved, total_amount\]
   */
  get isV9010(): boolean {
    return this.ctx._chain.getEventHash('slots.Leased') === '79675ebb51ddb0b8d4c0ab927d5f555aa83f9e61ccc6e9f3d99e02eb1d6b0f8d'
  }

  /**
   *  An existing parachain won the right to continue.
   *  First balance is the extra amount reseved. Second is the total amount reserved.
   *  \[parachain_id, leaser, period_begin, period_count, extra_reseved, total_amount\]
   */
  get asV9010(): [number, Uint8Array, number, number, bigint, bigint] {
    assert(this.isV9010)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9010
  }

  get asLatest(): [number, Uint8Array, number, number, bigint, bigint] {
    deprecateLatest()
    return this.asV9010
  }
}

export class SocietyAutoUnbidEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'society.AutoUnbid')
  }

  /**
   *  A candidate was dropped (due to an excess of bids in the system).
   */
  get isV1040(): boolean {
    return this.ctx._chain.getEventHash('society.AutoUnbid') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   *  A candidate was dropped (due to an excess of bids in the system).
   */
  get asV1040(): Uint8Array {
    assert(this.isV1040)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A candidate was dropped (due to an excess of bids in the system).
   */
  get isV9160(): boolean {
    return this.ctx._chain.getEventHash('society.AutoUnbid') === '3628b3aba77dce2d54e6db67e810eccf17921a84b907aea8b90a342fd5ad6c01'
  }

  /**
   * A candidate was dropped (due to an excess of bids in the system).
   */
  get asV9160(): {candidate: v9160.AccountId32} {
    assert(this.isV9160)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9160
  }

  get asLatest(): {candidate: v9160.AccountId32} {
    deprecateLatest()
    return this.asV9160
  }
}

export class SocietyBidEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'society.Bid')
  }

  /**
   *  A membership bid just happened. The given account is the candidate's ID and their offer
   *  is the second.
   */
  get isV1040(): boolean {
    return this.ctx._chain.getEventHash('society.Bid') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  A membership bid just happened. The given account is the candidate's ID and their offer
   *  is the second.
   */
  get asV1040(): [Uint8Array, bigint] {
    assert(this.isV1040)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A membership bid just happened. The given account is the candidate's ID and their offer
   * is the second.
   */
  get isV9160(): boolean {
    return this.ctx._chain.getEventHash('society.Bid') === '55a5fb0e9330bf9b92555951744ee4781deef686d68f1f5342c04d98998cc77c'
  }

  /**
   * A membership bid just happened. The given account is the candidate's ID and their offer
   * is the second.
   */
  get asV9160(): {candidateId: v9160.AccountId32, offer: bigint} {
    assert(this.isV9160)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9160
  }

  get asLatest(): {candidateId: v9160.AccountId32, offer: bigint} {
    deprecateLatest()
    return this.asV9160
  }
}

export class SocietyDefenderVoteEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'society.DefenderVote')
  }

  /**
   *  A vote has been placed for a defending member (voter, vote)
   */
  get isV1040(): boolean {
    return this.ctx._chain.getEventHash('society.DefenderVote') === '3e84284a56e2d90e928c790a4788cf7ee237d5a6d76716a3e8584e3dcc0319a0'
  }

  /**
   *  A vote has been placed for a defending member (voter, vote)
   */
  get asV1040(): [Uint8Array, boolean] {
    assert(this.isV1040)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A vote has been placed for a defending member
   */
  get isV9160(): boolean {
    return this.ctx._chain.getEventHash('society.DefenderVote') === '5611f54cf7fe8fff6eeebdd5aef829508eb29477f36591cfba061d2a40b126f6'
  }

  /**
   * A vote has been placed for a defending member
   */
  get asV9160(): {voter: v9160.AccountId32, vote: boolean} {
    assert(this.isV9160)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9160
  }

  get asLatest(): {voter: v9160.AccountId32, vote: boolean} {
    deprecateLatest()
    return this.asV9160
  }
}

export class SocietyUnbidEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'society.Unbid')
  }

  /**
   *  A candidate was dropped (by their request).
   */
  get isV1040(): boolean {
    return this.ctx._chain.getEventHash('society.Unbid') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   *  A candidate was dropped (by their request).
   */
  get asV1040(): Uint8Array {
    assert(this.isV1040)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A candidate was dropped (by their request).
   */
  get isV9160(): boolean {
    return this.ctx._chain.getEventHash('society.Unbid') === '3628b3aba77dce2d54e6db67e810eccf17921a84b907aea8b90a342fd5ad6c01'
  }

  /**
   * A candidate was dropped (by their request).
   */
  get asV9160(): {candidate: v9160.AccountId32} {
    assert(this.isV9160)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9160
  }

  get asLatest(): {candidate: v9160.AccountId32} {
    deprecateLatest()
    return this.asV9160
  }
}

export class SocietyUnvouchEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'society.Unvouch')
  }

  /**
   *  A candidate was dropped (by request of who vouched for them).
   */
  get isV1040(): boolean {
    return this.ctx._chain.getEventHash('society.Unvouch') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   *  A candidate was dropped (by request of who vouched for them).
   */
  get asV1040(): Uint8Array {
    assert(this.isV1040)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A candidate was dropped (by request of who vouched for them).
   */
  get isV9160(): boolean {
    return this.ctx._chain.getEventHash('society.Unvouch') === '3628b3aba77dce2d54e6db67e810eccf17921a84b907aea8b90a342fd5ad6c01'
  }

  /**
   * A candidate was dropped (by request of who vouched for them).
   */
  get asV9160(): {candidate: v9160.AccountId32} {
    assert(this.isV9160)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9160
  }

  get asLatest(): {candidate: v9160.AccountId32} {
    deprecateLatest()
    return this.asV9160
  }
}

export class SocietyVoteEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'society.Vote')
  }

  /**
   *  A vote has been placed (candidate, voter, vote)
   */
  get isV1040(): boolean {
    return this.ctx._chain.getEventHash('society.Vote') === '297b1f9e3b7548d06cf345489141d90d9466aaad07e61033eb31d21c1babe5af'
  }

  /**
   *  A vote has been placed (candidate, voter, vote)
   */
  get asV1040(): [Uint8Array, Uint8Array, boolean] {
    assert(this.isV1040)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A vote has been placed
   */
  get isV9160(): boolean {
    return this.ctx._chain.getEventHash('society.Vote') === 'df0f0229341c8156a83fb471719b61cb6b9f060d57ec812d12284101c1a833ab'
  }

  /**
   * A vote has been placed
   */
  get asV9160(): {candidate: v9160.AccountId32, voter: v9160.AccountId32, vote: boolean} {
    assert(this.isV9160)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9160
  }

  get asLatest(): {candidate: v9160.AccountId32, voter: v9160.AccountId32, vote: boolean} {
    deprecateLatest()
    return this.asV9160
  }
}

export class SocietyVouchEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'society.Vouch')
  }

  /**
   *  A membership bid just happened by vouching. The given account is the candidate's ID and
   *  their offer is the second. The vouching party is the third.
   */
  get isV1040(): boolean {
    return this.ctx._chain.getEventHash('society.Vouch') === 'e5d45092dcac17c8173e3bc8fe6865f6fdfb171b3440a9bf9279ca36b62c16f9'
  }

  /**
   *  A membership bid just happened by vouching. The given account is the candidate's ID and
   *  their offer is the second. The vouching party is the third.
   */
  get asV1040(): [Uint8Array, bigint, Uint8Array] {
    assert(this.isV1040)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A membership bid just happened by vouching. The given account is the candidate's ID and
   * their offer is the second. The vouching party is the third.
   */
  get isV9160(): boolean {
    return this.ctx._chain.getEventHash('society.Vouch') === '9f01d73716aabbe4dba848916c9e8e8c0b6175dfdf49d0b6465f62c1f8943392'
  }

  /**
   * A membership bid just happened by vouching. The given account is the candidate's ID and
   * their offer is the second. The vouching party is the third.
   */
  get asV9160(): {candidateId: v9160.AccountId32, offer: bigint, vouching: v9160.AccountId32} {
    assert(this.isV9160)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9160
  }

  get asLatest(): {candidateId: v9160.AccountId32, offer: bigint, vouching: v9160.AccountId32} {
    deprecateLatest()
    return this.asV9160
  }
}

export class StakingBondedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'staking.Bonded')
  }

  /**
   *  An account has bonded this amount.
   * 
   *  NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
   *  it will not be emitted for staking rewards when they are added to stake.
   */
  get isV1051(): boolean {
    return this.ctx._chain.getEventHash('staking.Bonded') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  An account has bonded this amount.
   * 
   *  NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
   *  it will not be emitted for staking rewards when they are added to stake.
   */
  get asV1051(): [Uint8Array, bigint] {
    assert(this.isV1051)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1051
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1051
  }
}

export class StakingChilledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'staking.Chilled')
  }

  /**
   *  An account has stopped participating as either a validator or nominator.
   *  \[stash\]
   */
  get isV9090(): boolean {
    return this.ctx._chain.getEventHash('staking.Chilled') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   *  An account has stopped participating as either a validator or nominator.
   *  \[stash\]
   */
  get asV9090(): Uint8Array {
    assert(this.isV9090)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9090
  }

  get asLatest(): Uint8Array {
    deprecateLatest()
    return this.asV9090
  }
}

export class StakingKickedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'staking.Kicked')
  }

  /**
   *  A nominator has been kicked from a validator. \[nominator, stash\]
   */
  get isV2028(): boolean {
    return this.ctx._chain.getEventHash('staking.Kicked') === 'e54ae910805a8a9413af1a7f5885a5d0ba5f4e105175cd6b0ce2a8702ddf1861'
  }

  /**
   *  A nominator has been kicked from a validator. \[nominator, stash\]
   */
  get asV2028(): [Uint8Array, Uint8Array] {
    assert(this.isV2028)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV2028
  }

  get asLatest(): [Uint8Array, Uint8Array] {
    deprecateLatest()
    return this.asV2028
  }
}

export class StakingPayoutStartedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'staking.PayoutStarted')
  }

  /**
   *  The stakers' rewards are getting paid. \[era_index, validator_stash\]
   */
  get isV9090(): boolean {
    return this.ctx._chain.getEventHash('staking.PayoutStarted') === '0379562584d6426ccff49705dfa9dba95ad94215b772fd97d0ad0c4ca0001c12'
  }

  /**
   *  The stakers' rewards are getting paid. \[era_index, validator_stash\]
   */
  get asV9090(): [number, Uint8Array] {
    assert(this.isV9090)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9090
  }

  get asLatest(): [number, Uint8Array] {
    deprecateLatest()
    return this.asV9090
  }
}

export class StakingRewardedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'staking.Rewarded')
  }

  /**
   *  The nominator has been rewarded by this amount. \[stash, amount\]
   */
  get isV9090(): boolean {
    return this.ctx._chain.getEventHash('staking.Rewarded') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  The nominator has been rewarded by this amount. \[stash, amount\]
   */
  get asV9090(): [Uint8Array, bigint] {
    assert(this.isV9090)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9090
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV9090
  }
}

export class StakingSlashedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'staking.Slashed')
  }

  /**
   *  One validator (and its nominators) has been slashed by the given amount.
   *  \[validator, amount\]
   */
  get isV9090(): boolean {
    return this.ctx._chain.getEventHash('staking.Slashed') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  One validator (and its nominators) has been slashed by the given amount.
   *  \[validator, amount\]
   */
  get asV9090(): [Uint8Array, bigint] {
    assert(this.isV9090)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9090
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV9090
  }
}

export class StakingUnbondedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'staking.Unbonded')
  }

  /**
   *  An account has unbonded this amount.
   */
  get isV1051(): boolean {
    return this.ctx._chain.getEventHash('staking.Unbonded') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  An account has unbonded this amount.
   */
  get asV1051(): [Uint8Array, bigint] {
    assert(this.isV1051)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1051
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1051
  }
}

export class StakingWithdrawnEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'staking.Withdrawn')
  }

  /**
   *  An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`
   *  from the unlocking queue.
   */
  get isV1051(): boolean {
    return this.ctx._chain.getEventHash('staking.Withdrawn') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`
   *  from the unlocking queue.
   */
  get asV1051(): [Uint8Array, bigint] {
    assert(this.isV1051)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1051
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1051
  }
}

export class VestingVestingCompletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'vesting.VestingCompleted')
  }

  /**
   *  An account (given) has become fully vested. No further vesting can happen.
   */
  get isV1050(): boolean {
    return this.ctx._chain.getEventHash('vesting.VestingCompleted') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   *  An account (given) has become fully vested. No further vesting can happen.
   */
  get asV1050(): Uint8Array {
    assert(this.isV1050)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * An \[account\] has become fully vested.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('vesting.VestingCompleted') === '7fb7672b764b0a4f0c4910fddefec0709628843df7ad0073a97eede13c53ca92'
  }

  /**
   * An \[account\] has become fully vested.
   */
  get asV9130(): {account: v9130.AccountId32} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {account: v9130.AccountId32} {
    deprecateLatest()
    return this.asV9130
  }
}

export class VestingVestingUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'vesting.VestingUpdated')
  }

  /**
   *  The amount vested has been updated. This could indicate more funds are available. The
   *  balance given is the amount which is left unvested (and thus locked).
   */
  get isV1050(): boolean {
    return this.ctx._chain.getEventHash('vesting.VestingUpdated') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  The amount vested has been updated. This could indicate more funds are available. The
   *  balance given is the amount which is left unvested (and thus locked).
   */
  get asV1050(): [Uint8Array, bigint] {
    assert(this.isV1050)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * The amount vested has been updated. This could indicate a change in funds available.
   * The balance given is the amount which is left unvested (and thus locked).
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('vesting.VestingUpdated') === '827ca6c1a4e85ce850afac4c8d4d055acd3be5c19141889b40808e42b2c769e3'
  }

  /**
   * The amount vested has been updated. This could indicate a change in funds available.
   * The balance given is the amount which is left unvested (and thus locked).
   */
  get asV9130(): {account: v9130.AccountId32, unvested: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {account: v9130.AccountId32, unvested: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}
