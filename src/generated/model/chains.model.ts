import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Token} from "./token.model"

@Entity_()
export class Chains {
  constructor(props?: Partial<Chains>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  nativeToken!: Token

  @Column_("text", {nullable: true})
  chainName!: string | undefined | null

  @Column_("text", {nullable: false})
  relayId!: string

  @Column_("bool", {nullable: true})
  relayChain!: boolean | undefined | null
}
