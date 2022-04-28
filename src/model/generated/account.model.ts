import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Chain} from "./chain.model"
import {Transfer} from "./transfer.model"
import {Balance} from "./balance.model"
import {HistoricalBalance} from "./historicalBalance.model"
import {Contribution} from "./contribution.model"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Chain, {nullable: false})
  chain!: Chain

  @Column_("text", {nullable: false})
  substrateAccount!: string

  @OneToMany_(() => Transfer, e => e.receiverAccount)
  incomingTransfers!: Transfer[]

  @OneToMany_(() => Transfer, e => e.senderAccount)
  outgoingTransfers!: Transfer[]

  @Index_()
  @ManyToOne_(() => Balance, {nullable: true})
  balance!: Balance | undefined | null

  @OneToMany_(() => HistoricalBalance, e => e.account)
  historicalBalances!: HistoricalBalance[]

  @OneToMany_(() => Contribution, e => e.account)
  contributions!: Contribution[]

  @Column_("bool", {nullable: false})
  isHolder!: boolean
}
