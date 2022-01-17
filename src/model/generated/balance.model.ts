import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Token} from "./token.model"

@Entity_()
export class Balance {
  constructor(props?: Partial<Balance>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  accountId!: Account

  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  tokenId!: Token

  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  freeBalance!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  bondedBalance!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  vestedBalance!: bigint | undefined | null
}
