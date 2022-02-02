module.exports = class Data1643654168964 {
  name = 'Data1643654168964'

  async up(db) {
    await db.query(`CREATE TABLE "debug_method_execution_time" ("id" character varying NOT NULL, "exec_start_at" TIMESTAMP WITH TIME ZONE NOT NULL, "exec_end_at" TIMESTAMP WITH TIME ZONE, "min_exec_time" integer, "max_exec_time" integer, "min_memory_usage" integer, "max_memory_usage" integer, "current_block_at_work" integer NOT NULL, CONSTRAINT "PK_cc7a12ddcd1cc1f2bff4b5c23fd" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "cached_account" DROP CONSTRAINT "FK_ad2e39e20bc33449a3275907f12"`)
    await db.query(`ALTER TABLE "cached_account" ADD CONSTRAINT "UQ_ad2e39e20bc33449a3275907f12" UNIQUE ("account_id")`)
    await db.query(`ALTER TABLE "cached_account" ADD CONSTRAINT "FK_ad2e39e20bc33449a3275907f12" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "debug_method_execution_time"`)
    await db.query(`ALTER TABLE "cached_account" ADD CONSTRAINT "FK_ad2e39e20bc33449a3275907f12" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "cached_account" DROP CONSTRAINT "UQ_ad2e39e20bc33449a3275907f12"`)
    await db.query(`ALTER TABLE "cached_account" DROP CONSTRAINT "FK_ad2e39e20bc33449a3275907f12"`)
  }
}
