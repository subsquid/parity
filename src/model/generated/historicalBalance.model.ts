import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Token} from "./token.model"

@Entity_()
export class HistoricalBalance {
  constructor(props?: Partial<HistoricalBalance>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  account!: Account

  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  token!: Token

  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  reservedBalance!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  freeBalance!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  lockedBalance!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  bondedBalance!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  vestedBalance!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  democracyBalance!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  electionBalance!: bigint | undefined | null
}
