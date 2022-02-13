import {
  Entity as Entity_,
  JoinColumn as JoinColumn_,
  OneToOne as OneToOne_,
  PrimaryColumn as PrimaryColumn_,
  RelationId as RelationId_,
  Column as Column_,
} from "typeorm";
import { Account } from "../generated";

@Entity_()
export class CachedAccount {
  constructor(props?: Partial<CachedAccount>) {
    Object.assign(this, props);
  }

  @OneToOne_(() => Account, { nullable: false, primary: true })
  @JoinColumn_()
  account!: Account;

  @PrimaryColumn_()
  @RelationId_(({ account }: CachedAccount) => account)
  accountId!: string;

  @Column_("timestamp with time zone", { nullable: true })
  blacklistedAtBlockTimestamp?: Date | null;

  @Column_("integer", { nullable: true })
  blacklistedAtBlockHeight?: number | null;
}
