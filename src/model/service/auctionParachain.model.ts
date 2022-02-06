import {
  Column as Column_,
  Entity as Entity_,
  Index as Index_,
  ManyToOne as ManyToOne_,
  PrimaryColumn as PrimaryColumn_,
} from "typeorm";
import { Auction } from "./auction.model";
import { Chain } from "../generated";

@Entity_()
export class AuctionParachain {
  constructor(props?: Partial<AuctionParachain>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Index_()
  @ManyToOne_(() => Auction, { nullable: false })
  auction!: Auction;

  @Index_()
  @ManyToOne_(() => Chain, { nullable: false })
  parachain!: Chain;

  @Column_("integer", { nullable: false })
  blockNum!: number;

  @Column_("timestamp with time zone", { nullable: false })
  createdAt!: Date;

  @Column_("integer", { nullable: false })
  firstSlot!: number;

  @Column_("integer", { nullable: false })
  lastSlot!: number;
}
