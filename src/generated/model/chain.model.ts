import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Chain {
  constructor(props?: Partial<Chain>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  tokenId!: string

  @Column_("text", {nullable: false})
  chainName!: string

  @Column_("text", {nullable: true})
  relayId!: string | undefined | null

  @Column_("text", {nullable: true})
  relayChain!: string | undefined | null
}
