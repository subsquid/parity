module.exports = class Data1641838871098 {
    name = 'Data1641838871098'

    async up(db) {
        await db.query(`CREATE TABLE "token"
                        (
                            "id"           character varying NOT NULL,
                            "token_symbol" text              NOT NULL,
                            "token_name"   text              NOT NULL,
                            CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE TABLE "account"
                        (
                            "id"          character varying NOT NULL,
                            "chain_id_id" character varying NOT NULL,
                            CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE INDEX "IDX_161fdf1910711e5abe793eb543" ON "account" ("chain_id_id") `)
        await db.query(`CREATE TABLE "parachain_leases"
                        (
                            "id"                   character varying NOT NULL,
                            "para_id"              integer           NOT NULL,
                            "lease_range"          text              NOT NULL,
                            "first_lease"          integer           NOT NULL,
                            "last_lease"           integer           NOT NULL,
                            "latest_bid_amount"    numeric           NOT NULL,
                            "active_for_auction"   text,
                            "winning_amount"       numeric,
                            "extra_amount"         numeric,
                            "won_bid_from"         text,
                            "num_block_won"        integer,
                            "winning_result_block" integer,
                            "has_won"              boolean           NOT NULL,
                            "parachain_id"         character varying NOT NULL,
                            "auction_id"           character varying,
                            CONSTRAINT "PK_fda8294c956880bda2771666a91" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE INDEX "IDX_d1ccf431430ad6ce759c972ddb" ON "parachain_leases" ("parachain_id") `)
        await db.query(`CREATE INDEX "IDX_7237948a5f4178c1272c69f242" ON "parachain_leases" ("auction_id") `)
        await db.query(`CREATE TABLE "contribution"
                        (
                            "id"           character varying        NOT NULL,
                            "crowdloan_id" text                     NOT NULL,
                            "amount"       numeric                  NOT NULL,
                            "block_num"    integer                  NOT NULL,
                            "timestamp"    TIMESTAMP WITH TIME ZONE NOT NULL,
                            "account_id"   character varying        NOT NULL,
                            "parachain_id" character varying        NOT NULL,
                            "fund_id"      character varying        NOT NULL,
                            CONSTRAINT "PK_878330fa5bb34475732a5883d58" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE INDEX "IDX_1e238c006392e74f87e2db5bf9" ON "contribution" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_676bed3b91141b1f2f4dde1cf2" ON "contribution" ("parachain_id") `)
        await db.query(`CREATE INDEX "IDX_df5e763df749a70ec9d9762838" ON "contribution" ("fund_id") `)
        await db.query(`CREATE TABLE "crowdloan"
                        (
                            "id"                  character varying        NOT NULL,
                            "para_id"             integer                  NOT NULL,
                            "cap"                 numeric                  NOT NULL,
                            "raised"              numeric                  NOT NULL,
                            "lock_expired_block"  integer                  NOT NULL,
                            "block_num"           integer,
                            "first_slot"          integer                  NOT NULL,
                            "last_slot"           integer                  NOT NULL,
                            "status"              text                     NOT NULL,
                            "lease_expired_block" integer,
                            "dissolved"           boolean,
                            "dissolved_date"      TIMESTAMP WITH TIME ZONE,
                            "dissolved_block"     integer,
                            "updated_at"          TIMESTAMP WITH TIME ZONE,
                            "created_at"          TIMESTAMP WITH TIME ZONE NOT NULL,
                            "is_finished"         boolean,
                            "won_auction_id"      text,
                            "parachain_id"        character varying        NOT NULL,
                            "token_id_id"         character varying        NOT NULL,
                            "depositor_id"        character varying        NOT NULL,
                            "verifier_id"         character varying,
                            CONSTRAINT "PK_19a05e349701577c8c1679ae84d" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE INDEX "IDX_005883fcd4519fa5ae88706b3a" ON "crowdloan" ("parachain_id") `)
        await db.query(`CREATE INDEX "IDX_c11b284d5c325228fb84c37bd0" ON "crowdloan" ("token_id_id") `)
        await db.query(`CREATE INDEX "IDX_11a46518655d4bd1935281b2c6" ON "crowdloan" ("depositor_id") `)
        await db.query(`CREATE INDEX "IDX_4a8a533166fcabd4bf45ebc4d4" ON "crowdloan" ("verifier_id") `)
        await db.query(`CREATE TABLE "chronicle"
                        (
                            "id"              character varying NOT NULL,
                            "cur_auction_id"  character varying,
                            "cur_block_num"   integer,
                            "cur_lease"       integer,
                            "cur_lease_start" integer,
                            "cur_lease_end"   integer,
                            CONSTRAINT "PK_1cfaa3cc7527bef31f9c85700f4" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE INDEX "IDX_f00a0560b45ec136d79e34d80b" ON "chronicle" ("cur_auction_id") `)
        await db.query(`CREATE TABLE "chains"
                        (
                            "id"              character varying NOT NULL,
                            "chain_name"      text,
                            "relay_id"        text              NOT NULL,
                            "para_id"         integer,
                            "relay_chain"     boolean,
                            "created_at"      TIMESTAMP WITH TIME ZONE,
                            "creation_block"  integer,
                            "deregistered"    boolean,
                            "deposit"         numeric,
                            "native_token_id" character varying,
                            "manager_id"      character varying,
                            "active_fund_id"  character varying,
                            "latest_bid_id"   character varying,
                            "chronicle_id"    character varying,
                            CONSTRAINT "PK_f3c6ca7e7ad0f451e3b8f3dd378" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE INDEX "IDX_3ad731269d900793a90b3cbf1c" ON "chains" ("native_token_id") `)
        await db.query(`CREATE INDEX "IDX_d682a75dd584c1a369008ab586" ON "chains" ("manager_id") `)
        await db.query(`CREATE INDEX "IDX_5ac9739a5ff19d5da40bca4050" ON "chains" ("active_fund_id") `)
        await db.query(`CREATE INDEX "IDX_70940e069095a20d685f7c7ed4" ON "chains" ("latest_bid_id") `)
        await db.query(`CREATE INDEX "IDX_73212be5543f021703039f4de5" ON "chains" ("chronicle_id") `)
        await db.query(`CREATE TABLE "bid"
                        (
                            "id"              character varying        NOT NULL,
                            "winning_auction" integer,
                            "block_num"       integer                  NOT NULL,
                            "is_crowdloan"    boolean                  NOT NULL,
                            "amount"          numeric                  NOT NULL,
                            "first_slot"      integer                  NOT NULL,
                            "last_slot"       integer                  NOT NULL,
                            "bidder"          text,
                            "timestamp"       TIMESTAMP WITH TIME ZONE NOT NULL,
                            "auction_id"      character varying        NOT NULL,
                            "parachain_id"    character varying        NOT NULL,
                            "fund_id"         character varying,
                            CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE INDEX "IDX_9e594e5a61c0f3cb25679f6ba8" ON "bid" ("auction_id") `)
        await db.query(`CREATE INDEX "IDX_930058fc447bce976650cf08f6" ON "bid" ("parachain_id") `)
        await db.query(`CREATE INDEX "IDX_1d89857ddf5ad51e46e929c86b" ON "bid" ("fund_id") `)
        await db.query(`CREATE TABLE "auction"
                        (
                            "id"            character varying        NOT NULL,
                            "block_num"     integer                  NOT NULL,
                            "status"        text                     NOT NULL,
                            "lease_start"   integer,
                            "slots_start"   integer                  NOT NULL,
                            "lease_end"     integer,
                            "slots_end"     integer                  NOT NULL,
                            "closing_start" integer                  NOT NULL,
                            "closing_end"   integer                  NOT NULL,
                            "result_block"  integer,
                            "ongoing"       boolean                  NOT NULL,
                            "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL,
                            CONSTRAINT "PK_9dc876c629273e71646cf6dfa67" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE TABLE "auction_parachain"
                        (
                            "id"           character varying        NOT NULL,
                            "block_num"    integer                  NOT NULL,
                            "timestamp"    TIMESTAMP WITH TIME ZONE NOT NULL,
                            "first_slot"   integer                  NOT NULL,
                            "last_slot"    integer                  NOT NULL,
                            "auction_id"   character varying        NOT NULL,
                            "parachain_id" character varying        NOT NULL,
                            CONSTRAINT "PK_f405bf3c601f7e5f97d9b1abd94" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE INDEX "IDX_bcdc4b1c157f29429b97a35809" ON "auction_parachain" ("auction_id") `)
        await db.query(`CREATE INDEX "IDX_09813e8f090426a27be8f78949" ON "auction_parachain" ("parachain_id") `)
        await db.query(`CREATE TABLE "crowdloan_sequence"
                        (
                            "id"         character varying        NOT NULL,
                            "cur_index"  integer                  NOT NULL,
                            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                            "block_num"  integer                  NOT NULL,
                            CONSTRAINT "PK_52c7e654f01224a6592dee9e0b6" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE TABLE "balance"
                        (
                            "id"             character varying        NOT NULL,
                            "timestamp"      TIMESTAMP WITH TIME ZONE NOT NULL,
                            "free_balance"   numeric,
                            "bonded_balance" numeric,
                            "vested_balance" numeric,
                            "account_id_id"  character varying        NOT NULL,
                            "token_id_id"    character varying        NOT NULL,
                            CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE INDEX "IDX_17086e775fb038f8d6631ef7cc" ON "balance" ("account_id_id") `)
        await db.query(`CREATE INDEX "IDX_3449d45a6144536db7db61e935" ON "balance" ("token_id_id") `)
        await db.query(`CREATE TABLE "transfers"
                        (
                            "id"                  character varying        NOT NULL,
                            "amount"              numeric                  NOT NULL,
                            "timestamp"           TIMESTAMP WITH TIME ZONE NOT NULL,
                            "sender_account_id"   character varying        NOT NULL,
                            "receiver_account_id" character varying        NOT NULL,
                            "token_id_id"         character varying        NOT NULL,
                            CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id")
                        )`)
        await db.query(`CREATE INDEX "IDX_f3157f2f977cddc39232adf678" ON "transfers" ("sender_account_id") `)
        await db.query(`CREATE INDEX "IDX_4e9ddc85f89da9fb4fcab02498" ON "transfers" ("receiver_account_id") `)
        await db.query(`CREATE INDEX "IDX_3745ac68ac34d923cc0e837985" ON "transfers" ("token_id_id") `)
        await db.query(`ALTER TABLE "account"
            ADD CONSTRAINT "FK_161fdf1910711e5abe793eb5437" FOREIGN KEY ("chain_id_id") REFERENCES "chains" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "parachain_leases"
            ADD CONSTRAINT "FK_d1ccf431430ad6ce759c972ddb1" FOREIGN KEY ("parachain_id") REFERENCES "chains" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "parachain_leases"
            ADD CONSTRAINT "FK_7237948a5f4178c1272c69f2429" FOREIGN KEY ("auction_id") REFERENCES "auction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "contribution"
            ADD CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b" FOREIGN KEY ("account_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "contribution"
            ADD CONSTRAINT "FK_676bed3b91141b1f2f4dde1cf28" FOREIGN KEY ("parachain_id") REFERENCES "chains" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "contribution"
            ADD CONSTRAINT "FK_df5e763df749a70ec9d97628383" FOREIGN KEY ("fund_id") REFERENCES "crowdloan" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "crowdloan"
            ADD CONSTRAINT "FK_005883fcd4519fa5ae88706b3a5" FOREIGN KEY ("parachain_id") REFERENCES "chains" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "crowdloan"
            ADD CONSTRAINT "FK_c11b284d5c325228fb84c37bd06" FOREIGN KEY ("token_id_id") REFERENCES "token" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "crowdloan"
            ADD CONSTRAINT "FK_11a46518655d4bd1935281b2c6e" FOREIGN KEY ("depositor_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "crowdloan"
            ADD CONSTRAINT "FK_4a8a533166fcabd4bf45ebc4d4d" FOREIGN KEY ("verifier_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "chronicle"
            ADD CONSTRAINT "FK_f00a0560b45ec136d79e34d80b0" FOREIGN KEY ("cur_auction_id") REFERENCES "auction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "chains"
            ADD CONSTRAINT "FK_3ad731269d900793a90b3cbf1c1" FOREIGN KEY ("native_token_id") REFERENCES "token" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "chains"
            ADD CONSTRAINT "FK_d682a75dd584c1a369008ab5862" FOREIGN KEY ("manager_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "chains"
            ADD CONSTRAINT "FK_5ac9739a5ff19d5da40bca40508" FOREIGN KEY ("active_fund_id") REFERENCES "crowdloan" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "chains"
            ADD CONSTRAINT "FK_70940e069095a20d685f7c7ed48" FOREIGN KEY ("latest_bid_id") REFERENCES "bid" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "chains"
            ADD CONSTRAINT "FK_73212be5543f021703039f4de58" FOREIGN KEY ("chronicle_id") REFERENCES "chronicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "bid"
            ADD CONSTRAINT "FK_9e594e5a61c0f3cb25679f6ba8d" FOREIGN KEY ("auction_id") REFERENCES "auction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "bid"
            ADD CONSTRAINT "FK_930058fc447bce976650cf08f67" FOREIGN KEY ("parachain_id") REFERENCES "chains" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "bid"
            ADD CONSTRAINT "FK_1d89857ddf5ad51e46e929c86b5" FOREIGN KEY ("fund_id") REFERENCES "crowdloan" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "auction_parachain"
            ADD CONSTRAINT "FK_bcdc4b1c157f29429b97a35809c" FOREIGN KEY ("auction_id") REFERENCES "auction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "auction_parachain"
            ADD CONSTRAINT "FK_09813e8f090426a27be8f789498" FOREIGN KEY ("parachain_id") REFERENCES "chains" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "balance"
            ADD CONSTRAINT "FK_17086e775fb038f8d6631ef7ccb" FOREIGN KEY ("account_id_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "balance"
            ADD CONSTRAINT "FK_3449d45a6144536db7db61e935d" FOREIGN KEY ("token_id_id") REFERENCES "token" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfers"
            ADD CONSTRAINT "FK_f3157f2f977cddc39232adf6786" FOREIGN KEY ("sender_account_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfers"
            ADD CONSTRAINT "FK_4e9ddc85f89da9fb4fcab024983" FOREIGN KEY ("receiver_account_id") REFERENCES "account" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfers"
            ADD CONSTRAINT "FK_3745ac68ac34d923cc0e8379850" FOREIGN KEY ("token_id_id") REFERENCES "token" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "token"`)
        await db.query(`DROP TABLE "account"`)
        await db.query(`DROP INDEX "public"."IDX_161fdf1910711e5abe793eb543"`)
        await db.query(`DROP TABLE "parachain_leases"`)
        await db.query(`DROP INDEX "public"."IDX_d1ccf431430ad6ce759c972ddb"`)
        await db.query(`DROP INDEX "public"."IDX_7237948a5f4178c1272c69f242"`)
        await db.query(`DROP TABLE "contribution"`)
        await db.query(`DROP INDEX "public"."IDX_1e238c006392e74f87e2db5bf9"`)
        await db.query(`DROP INDEX "public"."IDX_676bed3b91141b1f2f4dde1cf2"`)
        await db.query(`DROP INDEX "public"."IDX_df5e763df749a70ec9d9762838"`)
        await db.query(`DROP TABLE "crowdloan"`)
        await db.query(`DROP INDEX "public"."IDX_005883fcd4519fa5ae88706b3a"`)
        await db.query(`DROP INDEX "public"."IDX_c11b284d5c325228fb84c37bd0"`)
        await db.query(`DROP INDEX "public"."IDX_11a46518655d4bd1935281b2c6"`)
        await db.query(`DROP INDEX "public"."IDX_4a8a533166fcabd4bf45ebc4d4"`)
        await db.query(`DROP TABLE "chronicle"`)
        await db.query(`DROP INDEX "public"."IDX_f00a0560b45ec136d79e34d80b"`)
        await db.query(`DROP TABLE "chains"`)
        await db.query(`DROP INDEX "public"."IDX_3ad731269d900793a90b3cbf1c"`)
        await db.query(`DROP INDEX "public"."IDX_d682a75dd584c1a369008ab586"`)
        await db.query(`DROP INDEX "public"."IDX_5ac9739a5ff19d5da40bca4050"`)
        await db.query(`DROP INDEX "public"."IDX_70940e069095a20d685f7c7ed4"`)
        await db.query(`DROP INDEX "public"."IDX_73212be5543f021703039f4de5"`)
        await db.query(`DROP TABLE "bid"`)
        await db.query(`DROP INDEX "public"."IDX_9e594e5a61c0f3cb25679f6ba8"`)
        await db.query(`DROP INDEX "public"."IDX_930058fc447bce976650cf08f6"`)
        await db.query(`DROP INDEX "public"."IDX_1d89857ddf5ad51e46e929c86b"`)
        await db.query(`DROP TABLE "auction"`)
        await db.query(`DROP TABLE "auction_parachain"`)
        await db.query(`DROP INDEX "public"."IDX_bcdc4b1c157f29429b97a35809"`)
        await db.query(`DROP INDEX "public"."IDX_09813e8f090426a27be8f78949"`)
        await db.query(`DROP TABLE "crowdloan_sequence"`)
        await db.query(`DROP TABLE "balance"`)
        await db.query(`DROP INDEX "public"."IDX_17086e775fb038f8d6631ef7cc"`)
        await db.query(`DROP INDEX "public"."IDX_3449d45a6144536db7db61e935"`)
        await db.query(`DROP TABLE "transfers"`)
        await db.query(`DROP INDEX "public"."IDX_f3157f2f977cddc39232adf678"`)
        await db.query(`DROP INDEX "public"."IDX_4e9ddc85f89da9fb4fcab02498"`)
        await db.query(`DROP INDEX "public"."IDX_3745ac68ac34d923cc0e837985"`)
        await db.query(`ALTER TABLE "account"
            DROP CONSTRAINT "FK_161fdf1910711e5abe793eb5437"`)
        await db.query(`ALTER TABLE "parachain_leases"
            DROP CONSTRAINT "FK_d1ccf431430ad6ce759c972ddb1"`)
        await db.query(`ALTER TABLE "parachain_leases"
            DROP CONSTRAINT "FK_7237948a5f4178c1272c69f2429"`)
        await db.query(`ALTER TABLE "contribution"
            DROP CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b"`)
        await db.query(`ALTER TABLE "contribution"
            DROP CONSTRAINT "FK_676bed3b91141b1f2f4dde1cf28"`)
        await db.query(`ALTER TABLE "contribution"
            DROP CONSTRAINT "FK_df5e763df749a70ec9d97628383"`)
        await db.query(`ALTER TABLE "crowdloan"
            DROP CONSTRAINT "FK_005883fcd4519fa5ae88706b3a5"`)
        await db.query(`ALTER TABLE "crowdloan"
            DROP CONSTRAINT "FK_c11b284d5c325228fb84c37bd06"`)
        await db.query(`ALTER TABLE "crowdloan"
            DROP CONSTRAINT "FK_11a46518655d4bd1935281b2c6e"`)
        await db.query(`ALTER TABLE "crowdloan"
            DROP CONSTRAINT "FK_4a8a533166fcabd4bf45ebc4d4d"`)
        await db.query(`ALTER TABLE "chronicle"
            DROP CONSTRAINT "FK_f00a0560b45ec136d79e34d80b0"`)
        await db.query(`ALTER TABLE "chains"
            DROP CONSTRAINT "FK_3ad731269d900793a90b3cbf1c1"`)
        await db.query(`ALTER TABLE "chains"
            DROP CONSTRAINT "FK_d682a75dd584c1a369008ab5862"`)
        await db.query(`ALTER TABLE "chains"
            DROP CONSTRAINT "FK_5ac9739a5ff19d5da40bca40508"`)
        await db.query(`ALTER TABLE "chains"
            DROP CONSTRAINT "FK_70940e069095a20d685f7c7ed48"`)
        await db.query(`ALTER TABLE "chains"
            DROP CONSTRAINT "FK_73212be5543f021703039f4de58"`)
        await db.query(`ALTER TABLE "bid"
            DROP CONSTRAINT "FK_9e594e5a61c0f3cb25679f6ba8d"`)
        await db.query(`ALTER TABLE "bid"
            DROP CONSTRAINT "FK_930058fc447bce976650cf08f67"`)
        await db.query(`ALTER TABLE "bid"
            DROP CONSTRAINT "FK_1d89857ddf5ad51e46e929c86b5"`)
        await db.query(`ALTER TABLE "auction_parachain"
            DROP CONSTRAINT "FK_bcdc4b1c157f29429b97a35809c"`)
        await db.query(`ALTER TABLE "auction_parachain"
            DROP CONSTRAINT "FK_09813e8f090426a27be8f789498"`)
        await db.query(`ALTER TABLE "balance"
            DROP CONSTRAINT "FK_17086e775fb038f8d6631ef7ccb"`)
        await db.query(`ALTER TABLE "balance"
            DROP CONSTRAINT "FK_3449d45a6144536db7db61e935d"`)
        await db.query(`ALTER TABLE "transfers"
            DROP CONSTRAINT "FK_f3157f2f977cddc39232adf6786"`)
        await db.query(`ALTER TABLE "transfers"
            DROP CONSTRAINT "FK_4e9ddc85f89da9fb4fcab024983"`)
        await db.query(`ALTER TABLE "transfers"
            DROP CONSTRAINT "FK_3745ac68ac34d923cc0e8379850"`)
    }
}