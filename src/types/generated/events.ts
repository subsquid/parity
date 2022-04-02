import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v2008 from './v2008'
import * as v9122 from './v9122'
import * as v9130 from './v9130'

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
