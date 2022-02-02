import {
  Entity as Entity_,
  JoinColumn as JoinColumn_,
  OneToOne as OneToOne_,
  PrimaryColumn as PrimaryColumn_,
  RelationId as RelationId_,
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
}
