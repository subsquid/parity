import assert from 'assert'
import {EventContext, Result} from './support'
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
  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('auctions.AuctionClosed') === 'fdcb56e53c2eee0a5ba9d908763e3ef3ab819d6fecbfbd5f474ad1557539977b'
  }

  /**
   *  An auction ended. All funds become unreserved. [auction_index]
   */
  get asLatest(): number {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('auctions.AuctionStarted') === 'e1644b8dd09defba3c2837a62c9b939e6a6f3a0bc708ae22df33b6a026887ab8'
  }

  /**
   *  An auction started. Provides its index and the block number where it will begin to
   *  close and the first lease period of the quadruplet that is auctioned.
   *  [auction_index, lease_period, ending]
   */
  get asLatest(): [number, number, number] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('auctions.BidAccepted') === '02d7badf9f8b02f043ed83365af4040117e15ce338c04f0f39488f7fceb3ff33'
  }

  /**
   *  A new bid has been accepted as the current winner.
   *  \[who, para_id, amount, first_slot, last_slot\]
   */
  get asLatest(): [Uint8Array, number, bigint, number, number] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('auctions.Reserved') === '787a0023d4d1b55dfb45e23e339a9a7d31cd4323816d6930f58ec565efb2e64b'
  }

  /**
   *  Funds were reserved for a winning bid. First balance is the extra amount reserved.
   *  Second is the total. [bidder, extra_reserved, total_amount]
   */
  get asLatest(): [Uint8Array, bigint, bigint] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class AuctionsUnreservedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'auctions.Unreserved')
  }

  /**
   *  Funds were unreserved since bidder is no longer active. [bidder, amount]
   */
  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('auctions.Unreserved') === '655b54395ff5599b25bca1b094fa2beef5a393bf3e792d0365a1329f8596fc5d'
  }

  /**
   *  Funds were unreserved since bidder is no longer active. [bidder, amount]
   */
  get asLatest(): [Uint8Array, bigint] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('auctions.WinningOffset') === '5cb35ae3c5998107c65167938b186b12dd3b5dcb2ce5065d4dfdfc30e4bcf5d2'
  }

  /**
   *  The winning offset was chosen for an auction. This will map into the `Winning` storage map.
   *  \[auction_index, block_number\]
   */
  get asLatest(): [number, number] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 295787 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('balances.BalanceSet') === '83f90320fcee34b0ccab7d8893f1c4f21dfe5ef623391171b12b112107efa2b1'
  }

  /**
   * A balance was set by root.
   */
  get asLatest(): {who: v9130.AccountId32, free: bigint, reserved: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 461692 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('balances.Deposit') === '042054185e0c4221bfb671c8699bcdbefc2f6daba2dddfe3c36a647fd3bf8f88'
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get asLatest(): {who: v9130.AccountId32, amount: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 1375086 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('balances.DustLost') === 'a5120e116c962665deb90888f63997f80bf264736905d1919c950d4ec72b8135'
  }

  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss.
   */
  get asLatest(): {account: v9130.AccountId32, amount: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 1375086 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('balances.Endowed') === '11ab78688223cb378b33ad036f9e746b6b063bc2df7a3250d58ea34ae6c4771f'
  }

  /**
   * An account was created with some free balance.
   */
  get asLatest(): {account: v9130.AccountId32, freeBalance: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class BalancesNewAccountEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.NewAccount')
  }

  /**
   *  A new account was created.
   */
  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('balances.NewAccount') === '51291de01eb2c39714624f7d9a15a12b207170929fea952f7563f265fc069bb2'
  }

  /**
   *  A new account was created.
   */
  get asLatest(): [Uint8Array, bigint] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 2728002 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('balances.ReserveRepatriated') === '258088f3091b3ed69ad6c19a26b970315b35949bca136ef52b036d10f5c98170'
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  get asLatest(): {from: v9130.AccountId32, to: v9130.AccountId32, amount: bigint, destinationStatus: v9130.BalanceStatus} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 2728002 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('balances.Reserved') === '086dab867f35715cb62257a9ecba6b7fe895885e87598482c4888d2fe1cb73d4'
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get asLatest(): {who: v9130.AccountId32, amount: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 9866422 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('balances.Slashed') === '20ecfc9158e36663830a8e3932996d1284032a25c6c1416f814bcee83a31147b'
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior).
   */
  get asLatest(): {who: v9130.AccountId32, amount: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return h <= 1375086
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
    let h = this.ctx.block.height
    return 1375086 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('balances.Transfer') === '68dcb27fbf3d9279c1115ef6dd9d30a3852b23d8e91c1881acd12563a212512d'
  }

  /**
   * Transfer succeeded.
   */
  get asLatest(): {from: v9130.AccountId32, to: v9130.AccountId32, amount: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 2728002 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('balances.Unreserved') === 'ab10c2de5bc4158553e3a9e616bbe18ae186166f3b08734579777a05b485f8bb'
  }

  /**
   * Some balance was unreserved (moved from reserved to free).
   */
  get asLatest(): {who: v9130.AccountId32, amount: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 9866422 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('balances.Withdraw') === 'c215bc1c909253586ca430cd5d467093dcfc83a323efa63a29550508bc8c5408'
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get asLatest(): {who: v9130.AccountId32, amount: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class CrowdloanContributedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'crowdloan.Contributed')
  }

  /**
   *  Contributed to a crowd sale. [who, fund_index, amount]
   */
  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('crowdloan.Contributed') === '3690bc952f917f777e40a3530d9836ce4ca663f50f89650418174e335b475ff9'
  }

  /**
   *  Contributed to a crowd sale. [who, fund_index, amount]
   */
  get asLatest(): [Uint8Array, number, bigint] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class CrowdloanCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'crowdloan.Created')
  }

  /**
   *  Create a new crowdloaning campaign. [fund_index]
   */
  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('crowdloan.Created') === '06134b22c03f7cf6e0274993c5c5d5dd7515ecf8930c7616462642e1616e5f04'
  }

  /**
   *  Create a new crowdloaning campaign. [fund_index]
   */
  get asLatest(): number {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class CrowdloanDissolvedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'crowdloan.Dissolved')
  }

  /**
   *  Fund is dissolved. [fund_index]
   */
  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('crowdloan.Dissolved') === '54d8d8c3e443fe2deb6899a99e70eeaac03db01683e93755bb1275f0448b0403'
  }

  /**
   *  Fund is dissolved. [fund_index]
   */
  get asLatest(): number {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class RegistrarDeregisteredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'registrar.Deregistered')
  }

  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('registrar.Deregistered') === '213c829eef86c3cbf2fc87a4c1f92aaaf98e44b645bdbb11a569b166a99842f0'
  }

  get asLatest(): number {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class RegistrarRegisteredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'registrar.Registered')
  }

  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('registrar.Registered') === '958b1a32401a8ea8f2534d942feaf20b4f5c76ceb4825231b325944b10f35b5b'
  }

  get asLatest(): [number, Uint8Array] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
  get isLatest(): boolean {
    return this.ctx.block.height > 7468792 && this.ctx._chain.getEventHash('slots.Leased') === 'fb0643f9dea9c215c8d64de7ba7aa6f05f0c6d979848db35de9c75e071242c7c'
  }

  /**
   *  An existing parachain won the right to continue.
   *  First balance is the extra amount reseved. Second is the total amount reserved.
   *  \[parachain_id, leaser, period_begin, period_count, extra_reseved, total_amount\]
   */
  get asLatest(): [number, Uint8Array, number, number, bigint, bigint] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class SlotsNewLeasePeriodEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'slots.NewLeasePeriod')
  }

  /**
   *  A new lease period is beginning.
   */
  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('slots.NewLeasePeriod') === '0abde01f662330187aa5cee2a9a7a9442f750b6a6513630c04fa0e237777c3fd'
  }

  /**
   *  A new lease period is beginning.
   */
  get asLatest(): number {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
  get isLatest(): boolean {
    return this.ctx.block.height > 1445458 && this.ctx._chain.getEventHash('staking.Bonded') === '47facb114cad5e5d0612ab12cd27899aed054423f61b0ee4027c8d49284108a0'
  }

  /**
   *  An account has bonded this amount.
   * 
   *  NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
   *  it will not be emitted for staking rewards when they are added to stake.
   */
  get asLatest(): [Uint8Array, bigint] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class StakingUnbondedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'staking.Unbonded')
  }

  /**
   *  An account has unbonded this amount.
   */
  get isLatest(): boolean {
    return this.ctx.block.height > 1445458 && this.ctx._chain.getEventHash('staking.Unbonded') === '285f3d8850d41cfb19105193c25afbd8f44056ce2ac4b135a1fa1607c5eb5f96'
  }

  /**
   *  An account has unbonded this amount.
   */
  get asLatest(): [Uint8Array, bigint] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 1375086 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('vesting.VestingCompleted') === '3f29e569c8892fc5498d1cbbf899f93857a588bd2de0e83863f4feb02720d31f'
  }

  /**
   * An \[account\] has become fully vested.
   */
  get asLatest(): {account: v9130.AccountId32} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
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
    let h = this.ctx.block.height
    return 1375086 < h && h <= 10403784
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
  get isLatest(): boolean {
    return this.ctx.block.height > 10403784 && this.ctx._chain.getEventHash('vesting.VestingUpdated') === 'b4bdbb5b3196efb87a7f4227949b25b0cbeb74a114db9da4496ee6071746bb66'
  }

  /**
   * The amount vested has been updated. This could indicate a change in funds available.
   * The balance given is the amount which is left unvested (and thus locked).
   */
  get asLatest(): {account: v9130.AccountId32, unvested: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}
