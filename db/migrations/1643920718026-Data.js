module.exports = class Data1643920718026 {
  name = 'Data1643920718026'

  async up(db) {
    await db.query(`ALTER TABLE "debug_method_execution_time" ADD "metadata" text`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "debug_method_execution_time" DROP COLUMN "metadata"`)
  }
}
