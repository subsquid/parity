import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "../marshal"
import {Chains} from "./chains.model"
import {Token} from "./token.model"
import {Account} from "./account.model"
import {Contribution} from "./contribution.model"

@Entity_()
export class Crowdloan {
  constructor(props?: Partial<Crowdloan>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Chains, {nullable: false})
  parachain!: Chains

  @Column_("text", {nullable: false})
  paraId!: string

  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  tokenId!: Token

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  depositor!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  verifier!: Account | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  cap!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  raised!: bigint

  @Column_("integer", {nullable: false})
  lockExpiredBlock!: number

  @Column_("integer", {nullable: true})
  blockNum!: number | undefined | null

  @Column_("integer", {nullable: false})
  firstSlot!: number

  @Column_("integer", {nullable: false})
  lastSlot!: number

  @Column_("text", {nullable: false})
  status!: string

  @Column_("integer", {nullable: true})
  leaseExpiredBlock!: number | undefined | null

  @Column_("bool", {nullable: true})
  dissolved!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  won!: boolean | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  dissolvedDate!: Date | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  leaseStart!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  leaseEnd!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  updatedAt!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("bool", {nullable: true})
  isFinished!: boolean | undefined | null

  @Column_("text", {nullable: true})
  wonAuctionId!: string | undefined | null

  @OneToMany_(() => Contribution, e => e.fund)
  contributions!: Contribution[]
}
