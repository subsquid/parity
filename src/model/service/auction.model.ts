import {
  Column as Column_,
  Entity as Entity_,
  Index as Index_,
  PrimaryColumn as PrimaryColumn_,
} from "typeorm";

@Entity_()
export class Auction {
  constructor(props?: Partial<Auction>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Column_("integer", { nullable: false })
  blockNum!: number;

  @Index_()
  @Column_("text", { nullable: false })
  status!: string;

  @Column_("integer", { nullable: true })
  leaseStart!: number | undefined | null;

  @Column_("integer", { nullable: false })
  slotsStart!: number;

  @Column_("integer", { nullable: true })
  leaseEnd!: number | undefined | null;

  @Column_("integer", { nullable: false })
  slotsEnd!: number;

  @Column_("integer", { nullable: false })
  closingStart!: number;

  @Column_("integer", { nullable: false })
  closingEnd!: number;

  @Column_("integer", { nullable: true })
  resultBlock!: number | undefined | null;

  @Index_()
  @Column_("bool", { nullable: false })
  ongoing!: boolean;
}
