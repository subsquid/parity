module.exports = class Data1650572761256 {
  name = 'Data1650572761256'

  async up(db) {
    await db.query(`ALTER TABLE "account" ADD "is_holder" boolean`)
    await db.query(`
        with balances as (select account_id
                          from balance
                          where coalesce(reserved_balance, 0) != 0
            or coalesce(free_balance, 0) != 0
            or coalesce(locked_balance, 0) != 0
            or coalesce(bonded_balance, 0) != 0
            or coalesce(vested_balance, 0) != 0
            or coalesce(democracy_balance, 0) != 0
            or coalesce(election_balance, 0) != 0)
        update account
        set is_holder = true
            from balances
        where account.id = balances.account_id
    `)
    await db.query(`
        update account
        set is_holder = false
        where is_holder is null;
    `)
    await db.query(`ALTER TABLE "account" ALTER COLUMN "is_holder" SET NOT NULL`)
    await db.query(`ALTER TABLE "cached_account" DROP CONSTRAINT "FK_ad2e39e20bc33449a3275907f12"`)
    await db.query(`ALTER TABLE "cached_account" ADD CONSTRAINT "UQ_ad2e39e20bc33449a3275907f12" UNIQUE ("account_id")`)
    await db.query(`ALTER TABLE "cached_account" ADD CONSTRAINT "FK_ad2e39e20bc33449a3275907f12" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "account" DROP COLUMN "is_holder"`)
    await db.query(`ALTER TABLE "cached_account" ADD CONSTRAINT "FK_ad2e39e20bc33449a3275907f12" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "cached_account" DROP CONSTRAINT "UQ_ad2e39e20bc33449a3275907f12"`)
    await db.query(`ALTER TABLE "cached_account" DROP CONSTRAINT "FK_ad2e39e20bc33449a3275907f12"`)
  }
}
