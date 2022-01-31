import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class DebugMethodExecutionTime {
  constructor(props?: Partial<DebugMethodExecutionTime>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("timestamp with time zone", {nullable: false})
  execStartAt!: Date

  @Column_("timestamp with time zone", {nullable: true})
  execEndAt!: Date | undefined | null

  @Column_("integer", {nullable: true})
  minExecTime!: number | undefined | null

  @Column_("integer", {nullable: true})
  maxExecTime!: number | undefined | null

  @Column_("integer", {nullable: true})
  minMemoryUsage!: number | undefined | null

  @Column_("integer", {nullable: true})
  maxMemoryUsage!: number | undefined | null

  @Column_("integer", {nullable: false})
  currentBlockAtWork!: number
}
