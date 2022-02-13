import {
  Column as Column_,
  Entity as Entity_,
  ObjectLiteral as ObjectLiteral_,
  PrimaryColumn as PrimaryColumn_,
} from "typeorm";

@Entity_()
export class DbCache<T extends ObjectLiteral_> {
  constructor(props?: Partial<DbCache<T>>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_("text")
  id!: string;

  @Column_("json")
  value!: T;

  @Column_("integer")
  readCounter!: number;
}
