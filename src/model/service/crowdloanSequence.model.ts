import {
  Column as Column_,
  Entity as Entity_,
  PrimaryColumn as PrimaryColumn_,
} from "typeorm";

@Entity_()
export class CrowdloanSequence {
  constructor(props?: Partial<CrowdloanSequence>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Column_("integer", { nullable: false })
  curIndex!: number;

  @Column_("integer", { nullable: false })
  blockNum!: number;

  @Column_("timestamp with time zone", { nullable: false })
  createdAt!: Date;
}
