import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Token} from "./token.model"

@Entity_()
export class Transfers {
  constructor(props?: Partial<Transfers>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  senderAccount!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  receiverAccount!: Account

  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  tokenId!: Token

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint

  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date
}
