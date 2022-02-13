module.exports = class Data1644782151013 {
  name = 'Data1644782151013'

  async up(db) {
    await db.query(`ALTER TABLE "account" ADD "balance_id" character varying`)
    await db.query(`ALTER TABLE "cached_account" DROP CONSTRAINT "FK_ad2e39e20bc33449a3275907f12"`)
    await db.query(`ALTER TABLE "cached_account" ADD CONSTRAINT "UQ_ad2e39e20bc33449a3275907f12" UNIQUE ("account_id")`)
    await db.query(`CREATE INDEX "IDX_bd893045760f719e24a95a4256" ON "account" ("balance_id") `)
    await db.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_bd893045760f719e24a95a42562" FOREIGN KEY ("balance_id") REFERENCES "balance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "cached_account" ADD CONSTRAINT "FK_ad2e39e20bc33449a3275907f12" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "account" DROP COLUMN "balance_id"`)
    await db.query(`ALTER TABLE "cached_account" ADD CONSTRAINT "FK_ad2e39e20bc33449a3275907f12" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "cached_account" DROP CONSTRAINT "UQ_ad2e39e20bc33449a3275907f12"`)
    await db.query(`DROP INDEX "public"."IDX_bd893045760f719e24a95a4256"`)
    await db.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_bd893045760f719e24a95a42562"`)
    await db.query(`ALTER TABLE "cached_account" DROP CONSTRAINT "FK_ad2e39e20bc33449a3275907f12"`)
  }
}
