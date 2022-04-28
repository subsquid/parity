import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Token} from "./token.model"

@Entity_()
export class Transfer {
  constructor(props?: Partial<Transfer>) {
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
  token!: Token

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amount!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

  @Column_("bool", {nullable: true})
  successful!: boolean | undefined | null
}
