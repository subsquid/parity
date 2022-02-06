import {
  Column as Column_,
  Entity as Entity_,
  Index as Index_,
  ManyToOne as ManyToOne_,
  PrimaryColumn as PrimaryColumn_,
} from "typeorm";
import * as marshal from "../generated/marshal";
import { Auction } from "./auction.model";
import { Chain, Crowdloan } from "../generated";

@Entity_()
export class Bid {
  constructor(props?: Partial<Bid>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Index_()
  @ManyToOne_(() => Auction, { nullable: false })
  auction!: Auction;

  @Index_()
  @ManyToOne_(() => Auction, { nullable: true })
  winningAuction!: Auction | undefined | null;

  @Index_()
  @Column_("integer", { nullable: false })
  blockNum!: number;

  @Index_()
  @ManyToOne_(() => Chain, { nullable: false })
  parachain!: Chain;

  @Column_("bool", { nullable: false })
  isCrowdloan!: boolean;

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  amount!: bigint;

  @Index_()
  @ManyToOne_(() => Crowdloan, { nullable: true })
  fund!: Crowdloan | undefined | null;

  @Column_("integer", { nullable: false })
  firstSlot!: number;

  @Column_("integer", { nullable: false })
  lastSlot!: number;

  @Column_("text", { nullable: true })
  bidder!: string | undefined | null;

  @Column_("timestamp with time zone", { nullable: false })
  createdAt!: Date;
}
