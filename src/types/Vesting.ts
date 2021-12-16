import {create} from './_registry'
import {AccountId32} from '@polkadot/types/interfaces'
import {u128} from '@polkadot/types'
import {SubstrateEvent} from '@subsquid/hydra-common'

export namespace Vesting {
  /**
   * The amount vested has been updated. This could indicate a change in funds available.
   * The balance given is the amount which is left unvested (and thus locked).
   */
  export class VestingUpdatedEvent {
    constructor(private event: SubstrateEvent) {}

    get params(): [AccountId32, u128] {
      return [create('AccountId32', this.event.params[0].value), create('u128', this.event.params[1].value)]
    }
  }

  /**
   * An \[account\] has become fully vested.
   */
  export class VestingCompletedEvent {
    constructor(private event: SubstrateEvent) {}

    get params(): [AccountId32] {
      return [create('AccountId32', this.event.params[0].value)]
    }
  }

}
