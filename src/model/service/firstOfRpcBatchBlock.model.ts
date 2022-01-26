import {
  Column as Column_,
  Entity as Entity_,
  PrimaryColumn as PrimaryColumn_,
  Check as Check_,
} from "typeorm";

export enum FirstOfRpcBatchBlockRowId {
  block = "block",
}

// one row table
@Entity_()
@Check_(`id = '${FirstOfRpcBatchBlockRowId.block}'`)
export class FirstOfRpcBatchBlock {
  constructor(props?: Partial<FirstOfRpcBatchBlock>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_({
    type: "enum",
    enum: FirstOfRpcBatchBlockRowId,
    default: FirstOfRpcBatchBlockRowId.block,
  })
  id!: FirstOfRpcBatchBlockRowId;

  @Column_("integer", { nullable: false })
  height!: number;

  @Column_("timestamp with time zone", { nullable: false })
  timestamp!: Date;
}
