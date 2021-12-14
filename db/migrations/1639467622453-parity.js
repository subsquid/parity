const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class parity1639467622453 {
    name = 'parity1639467622453'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "token_symbol" text NOT NULL, "token_name" text NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chains" ("id" character varying NOT NULL, "chain_name" text, "relay_id" text NOT NULL, "relay_chain" boolean, "native_token_id" character varying NOT NULL, CONSTRAINT "PK_f3c6ca7e7ad0f451e3b8f3dd378" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3ad731269d900793a90b3cbf1c" ON "chains" ("native_token_id") `);
        await queryRunner.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "chain_id_id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_161fdf1910711e5abe793eb543" ON "account" ("chain_id_id") `);
        await queryRunner.query(`CREATE TABLE "balance" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "free_balance" numeric, "bonded_balance" numeric, "vested_balance" numeric, "account_id_id" character varying NOT NULL, "token_id_id" character varying NOT NULL, CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_17086e775fb038f8d6631ef7cc" ON "balance" ("account_id_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3449d45a6144536db7db61e935" ON "balance" ("token_id_id") `);
        await queryRunner.query(`CREATE TABLE "transfers" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "sender_account_id" character varying NOT NULL, "receiver_account_id" character varying NOT NULL, "token_id_id" character varying NOT NULL, CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f3157f2f977cddc39232adf678" ON "transfers" ("sender_account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4e9ddc85f89da9fb4fcab02498" ON "transfers" ("receiver_account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3745ac68ac34d923cc0e837985" ON "transfers" ("token_id_id") `);
        await queryRunner.query(`ALTER TABLE "chains" ADD CONSTRAINT "FK_3ad731269d900793a90b3cbf1c1" FOREIGN KEY ("native_token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_161fdf1910711e5abe793eb5437" FOREIGN KEY ("chain_id_id") REFERENCES "chains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "balance" ADD CONSTRAINT "FK_17086e775fb038f8d6631ef7ccb" FOREIGN KEY ("account_id_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "balance" ADD CONSTRAINT "FK_3449d45a6144536db7db61e935d" FOREIGN KEY ("token_id_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_f3157f2f977cddc39232adf6786" FOREIGN KEY ("sender_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_4e9ddc85f89da9fb4fcab024983" FOREIGN KEY ("receiver_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_3745ac68ac34d923cc0e8379850" FOREIGN KEY ("token_id_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_3745ac68ac34d923cc0e8379850"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_4e9ddc85f89da9fb4fcab024983"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_f3157f2f977cddc39232adf6786"`);
        await queryRunner.query(`ALTER TABLE "balance" DROP CONSTRAINT "FK_3449d45a6144536db7db61e935d"`);
        await queryRunner.query(`ALTER TABLE "balance" DROP CONSTRAINT "FK_17086e775fb038f8d6631ef7ccb"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_161fdf1910711e5abe793eb5437"`);
        await queryRunner.query(`ALTER TABLE "chains" DROP CONSTRAINT "FK_3ad731269d900793a90b3cbf1c1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3745ac68ac34d923cc0e837985"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e9ddc85f89da9fb4fcab02498"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f3157f2f977cddc39232adf678"`);
        await queryRunner.query(`DROP TABLE "transfers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3449d45a6144536db7db61e935"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17086e775fb038f8d6631ef7cc"`);
        await queryRunner.query(`DROP TABLE "balance"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_161fdf1910711e5abe793eb543"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ad731269d900793a90b3cbf1c"`);
        await queryRunner.query(`DROP TABLE "chains"`);
        await queryRunner.query(`DROP TABLE "token"`);
    }
}
