module.exports = class Data1651178213777 {
  name = 'Data1651178213777'

  async up(db) {
    await db.query(`ALTER TABLE "transfer" ADD "successful" boolean`)
    await db.query(`ALTER TABLE "transfer" ALTER COLUMN "amount" DROP NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "transfer" DROP COLUMN "successful"`)
    await db.query(`ALTER TABLE "transfer" ALTER COLUMN "amount" SET NOT NULL`)
  }
}
