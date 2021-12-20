import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "../marshal"
import {Account} from "./account.model"
import {Chains} from "./chains.model"
import {Crowdloan} from "./crowdloan.model"

@Entity_()
export class Contribution {
  constructor(props?: Partial<Contribution>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  crowdloanId!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  account!: Account

  @Index_()
  @ManyToOne_(() => Chains, {nullable: false})
  parachain!: Chains

  @Index_()
  @ManyToOne_(() => Crowdloan, {nullable: false})
  fund!: Crowdloan

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint

  @Column_("integer", {nullable: false})
  blockNum!: number

  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date
}
