import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Chain} from "./chain.model"
import {Token} from "./token.model"
import {Contribution} from "./contribution.model"

@Entity_()
export class Crowdloan {
  constructor(props?: Partial<Crowdloan>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Chain, {nullable: false})
  para!: Chain

  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  token!: Token

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  cap!: bigint | undefined | null

  @Column_("integer", {nullable: true})
  slotStart!: number | undefined | null

  @Column_("integer", {nullable: true})
  slotEnd!: number | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  campaignCreateDate!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  campaignEndDate!: Date | undefined | null

  @Column_("bool", {nullable: false})
  won!: boolean

  @Column_("bool", {nullable: true})
  dissolve!: boolean | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  dissolvedDate!: Date | undefined | null

  @Column_("integer", {nullable: true})
  auctionNumber!: number | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  leaseStart!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  leaseEnd!: Date | undefined | null

  @OneToMany_(() => Contribution, e => e.crowdloan)
  contributions!: Contribution[]
}
