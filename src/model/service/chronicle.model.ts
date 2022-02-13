import {
  Entity as Entity_,
  Index as Index_,
  ManyToOne as ManyToOne_,
  PrimaryColumn as PrimaryColumn_,
} from "typeorm";
import { Auction } from "./auction.model";

@Entity_()
export class Chronicle {
  constructor(props?: Partial<Chronicle>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Index_()
  @ManyToOne_(() => Auction, { nullable: true })
  currentAuction?: Auction | null;
}
