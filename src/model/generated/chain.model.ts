import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Token} from "./token.model"
import {Crowdloan} from "./crowdloan.model"

@Entity_()
export class Chain {
  constructor(props?: Partial<Chain>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  nativeToken!: Token

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("text", {nullable: false})
  relayId!: string

  @Column_("bool", {nullable: false})
  relayChain!: boolean

  @Column_("timestamp with time zone", {nullable: false})
  registeredAt!: Date

  @Column_("timestamp with time zone", {nullable: true})
  deregisteredAt!: Date | undefined | null

  @OneToMany_(() => Crowdloan, e => e.para)
  crowdloans!: Crowdloan[]
}
