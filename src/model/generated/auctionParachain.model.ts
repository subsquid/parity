import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Auction} from "./auction.model"
import {Chains} from "./chains.model"

@Entity_()
export class AuctionParachain {
  constructor(props?: Partial<AuctionParachain>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Auction, {nullable: false})
  auction!: Auction

  @Index_()
  @ManyToOne_(() => Chains, {nullable: false})
  parachain!: Chains

  @Column_("integer", {nullable: false})
  blockNum!: number

  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

  @Column_("integer", {nullable: false})
  firstSlot!: number

  @Column_("integer", {nullable: false})
  lastSlot!: number
}
