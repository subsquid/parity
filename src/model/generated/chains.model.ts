import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Token} from "./token.model"
import {Account} from "./account.model"
import {ParachainLeases} from "./parachainLeases.model"
import {Bid} from "./bid.model"
import {Crowdloan} from "./crowdloan.model"
import {Chronicle} from "./chronicle.model"

@Entity_()
export class Chains {
  constructor(props?: Partial<Chains>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Token, {nullable: true})
  nativeToken!: Token | undefined | null

  @Column_("text", {nullable: true})
  chainName!: string | undefined | null

  @Column_("text", {nullable: false})
  relayId!: string

  @Column_("integer", {nullable: true})
  paraId!: number | undefined | null

  @Column_("bool", {nullable: true})
  relayChain!: boolean | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdAt!: Date | undefined | null

  @Column_("integer", {nullable: true})
  creationBlock!: number | undefined | null

  @Column_("bool", {nullable: true})
  deregistered!: boolean | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  deposit!: bigint | undefined | null

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  manager!: Account | undefined | null

  @OneToMany_(() => ParachainLeases, e => e.parachain)
  leases!: ParachainLeases[]

  @OneToMany_(() => Bid, e => e.parachain)
  bids!: Bid[]

  @OneToMany_(() => Crowdloan, e => e.parachain)
  funds!: Crowdloan[]

  @Index_()
  @ManyToOne_(() => Crowdloan, {nullable: true})
  activeFund!: Crowdloan | undefined | null

  @Index_()
  @ManyToOne_(() => Bid, {nullable: true})
  latestBid!: Bid | undefined | null

  @Index_()
  @ManyToOne_(() => Chronicle, {nullable: true})
  chronicle!: Chronicle | undefined | null
}
