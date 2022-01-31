module.exports = class Data1643559180268 {
  name = 'Data1643559180268'

  async up(db) {
    await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "chain" ("id" character varying NOT NULL, "name" text, "relay_id" text NOT NULL, "relay_chain" boolean NOT NULL, "registered_at" TIMESTAMP WITH TIME ZONE NOT NULL, "deregistered_at" TIMESTAMP WITH TIME ZONE, "native_token_id" character varying NOT NULL, CONSTRAINT "PK_8e273aafae283b886672c952ecd" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_aabcbc01e325275303ab57d6a0" ON "chain" ("native_token_id") `)
    await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "substrate_account" text NOT NULL, "chain_id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_6b15368424e1f5cf587c2f3c5a" ON "account" ("chain_id") `)
    await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "sender_account_id" character varying NOT NULL, "receiver_account_id" character varying NOT NULL, "token_id" character varying NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_d7089f27c281dd14263b7c0dd2" ON "transfer" ("sender_account_id") `)
    await db.query(`CREATE INDEX "IDX_baabf0a065adc6aae85c2c3b52" ON "transfer" ("receiver_account_id") `)
    await db.query(`CREATE INDEX "IDX_b27b1150b8a7af68424540613c" ON "transfer" ("token_id") `)
    await db.query(`CREATE TABLE "balance" ("id" character varying NOT NULL, "reserved_balance" numeric, "free_balance" numeric, "locked_balance" numeric, "bonded_balance" numeric, "vested_balance" numeric, "democracy_balance" numeric, "election_balance" numeric, "account_id" character varying NOT NULL, "token_id" character varying NOT NULL, CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_08a76919ccd3887911dd30b911" ON "balance" ("account_id") `)
    await db.query(`CREATE INDEX "IDX_0b0aa2866ff7aea6950efbd20c" ON "balance" ("token_id") `)
    await db.query(`CREATE TABLE "historical_balance" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "reserved_balance" numeric, "free_balance" numeric, "locked_balance" numeric, "bonded_balance" numeric, "vested_balance" numeric, "democracy_balance" numeric, "election_balance" numeric, "account_id" character varying NOT NULL, "token_id" character varying NOT NULL, CONSTRAINT "PK_74ac29ad0bdffb6d1281a1e17e8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_383ff006e4b59db91d32cb891e" ON "historical_balance" ("account_id") `)
    await db.query(`CREATE INDEX "IDX_eb0187b2c75328caff4dc4212a" ON "historical_balance" ("token_id") `)
    await db.query(`CREATE TABLE "crowdloan" ("id" character varying NOT NULL, "cap" numeric, "slot_start" integer, "slot_end" integer, "campaign_create_date" TIMESTAMP WITH TIME ZONE, "campaign_end_date" TIMESTAMP WITH TIME ZONE, "won" boolean NOT NULL, "dissolve" boolean, "dissolved_date" TIMESTAMP WITH TIME ZONE, "auction_number" integer, "lease_start" TIMESTAMP WITH TIME ZONE, "lease_end" TIMESTAMP WITH TIME ZONE, "para_id" character varying NOT NULL, "token_id" character varying NOT NULL, CONSTRAINT "PK_19a05e349701577c8c1679ae84d" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_ecb6ee938b55f2a247a2b9f175" ON "crowdloan" ("para_id") `)
    await db.query(`CREATE INDEX "IDX_fdb2e1a42184133ba909b03ba5" ON "crowdloan" ("token_id") `)
    await db.query(`CREATE TABLE "contribution" ("id" character varying NOT NULL, "withdrawal" boolean NOT NULL, "amount" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "crowdloan_id" character varying NOT NULL, "account_id" character varying NOT NULL, CONSTRAINT "PK_878330fa5bb34475732a5883d58" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_34a9b7747fbe547737724da5a3" ON "contribution" ("crowdloan_id") `)
    await db.query(`CREATE INDEX "IDX_1e238c006392e74f87e2db5bf9" ON "contribution" ("account_id") `)
    await db.query(`CREATE TABLE "cached_account" ("account_id" character varying NOT NULL, CONSTRAINT "REL_ad2e39e20bc33449a3275907f1" UNIQUE ("account_id"), CONSTRAINT "PK_ad2e39e20bc33449a3275907f12" PRIMARY KEY ("account_id"))`)
    await db.query(`CREATE TYPE "public"."first_of_rpc_batch_block_id_enum" AS ENUM('block')`)
    await db.query(`CREATE TABLE "first_of_rpc_batch_block" ("id" "public"."first_of_rpc_batch_block_id_enum" NOT NULL DEFAULT 'block', "height" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "CHK_278c4e218e5572050815d20a37" CHECK (id = 'block'), CONSTRAINT "PK_850c4064259405d6a6c47debfb0" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "crowdloan_sequence" ("id" character varying NOT NULL, "cur_index" integer NOT NULL, "block_num" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_52c7e654f01224a6592dee9e0b6" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "chain" ADD CONSTRAINT "FK_aabcbc01e325275303ab57d6a08" FOREIGN KEY ("native_token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_6b15368424e1f5cf587c2f3c5ac" FOREIGN KEY ("chain_id") REFERENCES "chain"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_d7089f27c281dd14263b7c0dd25" FOREIGN KEY ("sender_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_baabf0a065adc6aae85c2c3b527" FOREIGN KEY ("receiver_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_b27b1150b8a7af68424540613c7" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "balance" ADD CONSTRAINT "FK_08a76919ccd3887911dd30b9116" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "balance" ADD CONSTRAINT "FK_0b0aa2866ff7aea6950efbd20c0" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "historical_balance" ADD CONSTRAINT "FK_383ff006e4b59db91d32cb891e9" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "historical_balance" ADD CONSTRAINT "FK_eb0187b2c75328caff4dc4212a9" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "crowdloan" ADD CONSTRAINT "FK_ecb6ee938b55f2a247a2b9f1750" FOREIGN KEY ("para_id") REFERENCES "chain"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "crowdloan" ADD CONSTRAINT "FK_fdb2e1a42184133ba909b03ba5e" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_34a9b7747fbe547737724da5a3b" FOREIGN KEY ("crowdloan_id") REFERENCES "crowdloan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "cached_account" ADD CONSTRAINT "FK_ad2e39e20bc33449a3275907f12" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "token"`)
    await db.query(`DROP TABLE "chain"`)
    await db.query(`DROP INDEX "public"."IDX_aabcbc01e325275303ab57d6a0"`)
    await db.query(`DROP TABLE "account"`)
    await db.query(`DROP INDEX "public"."IDX_6b15368424e1f5cf587c2f3c5a"`)
    await db.query(`DROP TABLE "transfer"`)
    await db.query(`DROP INDEX "public"."IDX_d7089f27c281dd14263b7c0dd2"`)
    await db.query(`DROP INDEX "public"."IDX_baabf0a065adc6aae85c2c3b52"`)
    await db.query(`DROP INDEX "public"."IDX_b27b1150b8a7af68424540613c"`)
    await db.query(`DROP TABLE "balance"`)
    await db.query(`DROP INDEX "public"."IDX_08a76919ccd3887911dd30b911"`)
    await db.query(`DROP INDEX "public"."IDX_0b0aa2866ff7aea6950efbd20c"`)
    await db.query(`DROP TABLE "historical_balance"`)
    await db.query(`DROP INDEX "public"."IDX_383ff006e4b59db91d32cb891e"`)
    await db.query(`DROP INDEX "public"."IDX_eb0187b2c75328caff4dc4212a"`)
    await db.query(`DROP TABLE "crowdloan"`)
    await db.query(`DROP INDEX "public"."IDX_ecb6ee938b55f2a247a2b9f175"`)
    await db.query(`DROP INDEX "public"."IDX_fdb2e1a42184133ba909b03ba5"`)
    await db.query(`DROP TABLE "contribution"`)
    await db.query(`DROP INDEX "public"."IDX_34a9b7747fbe547737724da5a3"`)
    await db.query(`DROP INDEX "public"."IDX_1e238c006392e74f87e2db5bf9"`)
    await db.query(`DROP TABLE "cached_account"`)
    await db.query(`DROP TYPE "public"."first_of_rpc_batch_block_id_enum"`)
    await db.query(`DROP TABLE "first_of_rpc_batch_block"`)
    await db.query(`DROP TABLE "crowdloan_sequence"`)
    await db.query(`ALTER TABLE "chain" DROP CONSTRAINT "FK_aabcbc01e325275303ab57d6a08"`)
    await db.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_6b15368424e1f5cf587c2f3c5ac"`)
    await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_d7089f27c281dd14263b7c0dd25"`)
    await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_baabf0a065adc6aae85c2c3b527"`)
    await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_b27b1150b8a7af68424540613c7"`)
    await db.query(`ALTER TABLE "balance" DROP CONSTRAINT "FK_08a76919ccd3887911dd30b9116"`)
    await db.query(`ALTER TABLE "balance" DROP CONSTRAINT "FK_0b0aa2866ff7aea6950efbd20c0"`)
    await db.query(`ALTER TABLE "historical_balance" DROP CONSTRAINT "FK_383ff006e4b59db91d32cb891e9"`)
    await db.query(`ALTER TABLE "historical_balance" DROP CONSTRAINT "FK_eb0187b2c75328caff4dc4212a9"`)
    await db.query(`ALTER TABLE "crowdloan" DROP CONSTRAINT "FK_ecb6ee938b55f2a247a2b9f1750"`)
    await db.query(`ALTER TABLE "crowdloan" DROP CONSTRAINT "FK_fdb2e1a42184133ba909b03ba5e"`)
    await db.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_34a9b7747fbe547737724da5a3b"`)
    await db.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b"`)
    await db.query(`ALTER TABLE "cached_account" DROP CONSTRAINT "FK_ad2e39e20bc33449a3275907f12"`)
  }
}