import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1676181527973 implements MigrationInterface {
    name = 'Init1676181527973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "encrypted_claim_proofs" ("proof_id" SERIAL NOT NULL, "id" integer NOT NULL, "enc" bytea NOT NULL, "request_id" uuid NOT NULL, CONSTRAINT "PK_c9c273d5c5d583bbba1a99ce5a4" PRIMARY KEY ("proof_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d00edcf381eb3f54ba74937cc1" ON "encrypted_claim_proofs" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_991dab4fdd6f330495f85a4880" ON "encrypted_claim_proofs" ("request_id") `);
        await queryRunner.query(`CREATE TABLE "verification_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "link_id" uuid NOT NULL, "context" text NOT NULL, "status" integer NOT NULL, "communication_public_key" bytea NOT NULL, "communication_signature" bytea NOT NULL, "requestor_id" text NOT NULL, "created_at_s" integer NOT NULL, "updated_at_s" integer, "expires_at_s" integer NOT NULL, CONSTRAINT "PK_c5d405ea25e8abd5b0b096a4f6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb0d56eb06b329f38e2db1fba3" ON "verification_requests" ("link_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b4c1af204a21ca2bae82a14ecc" ON "verification_requests" ("requestor_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_dbbbdd0805ee5a938bf6fef9d6" ON "verification_requests" ("created_at_s") `);
        await queryRunner.query(`CREATE INDEX "IDX_a1da65a29ce3908e7f1988983d" ON "verification_requests" ("expires_at_s") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" text NOT NULL, "firebase_token" text, "created_at_s" integer NOT NULL, "updated_at_s" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" text NOT NULL, "name" text NOT NULL, "created_at_s" integer NOT NULL, "views" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9f8dea86e48a7216c4f5369c1e" ON "links" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4e5a35131b4032013ac5ed18fd" ON "links" ("created_at_s") `);
        await queryRunner.query(`CREATE TABLE "claims" ("id" integer NOT NULL, "chain_id" integer NOT NULL, "provider" text NOT NULL, "redacted_parameters" text NOT NULL, "owner_public_key" bytea NOT NULL, "timestamp_s" integer NOT NULL, "witness_addresses" text array NOT NULL, "link_id" uuid NOT NULL, CONSTRAINT "PK_96c91970c0dcb2f69fdccd0a698" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6e79ad2628f64bf516fdc71324" ON "claims" ("link_id") `);
        await queryRunner.query(`ALTER TABLE "encrypted_claim_proofs" ADD CONSTRAINT "proof-request-fk" FOREIGN KEY ("request_id") REFERENCES "verification_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "encrypted_claim_proofs" ADD CONSTRAINT "proof-claim-fk" FOREIGN KEY ("id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification_requests" ADD CONSTRAINT "verification-user-fk" FOREIGN KEY ("requestor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification_requests" ADD CONSTRAINT "verification-link-fk" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "link-user-id-fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "claims" ADD CONSTRAINT "claim-link-id-fk" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "claims" DROP CONSTRAINT "claim-link-id-fk"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "link-user-id-fk"`);
        await queryRunner.query(`ALTER TABLE "verification_requests" DROP CONSTRAINT "verification-link-fk"`);
        await queryRunner.query(`ALTER TABLE "verification_requests" DROP CONSTRAINT "verification-user-fk"`);
        await queryRunner.query(`ALTER TABLE "encrypted_claim_proofs" DROP CONSTRAINT "proof-claim-fk"`);
        await queryRunner.query(`ALTER TABLE "encrypted_claim_proofs" DROP CONSTRAINT "proof-request-fk"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6e79ad2628f64bf516fdc71324"`);
        await queryRunner.query(`DROP TABLE "claims"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e5a35131b4032013ac5ed18fd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9f8dea86e48a7216c4f5369c1e"`);
        await queryRunner.query(`DROP TABLE "links"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a1da65a29ce3908e7f1988983d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dbbbdd0805ee5a938bf6fef9d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4c1af204a21ca2bae82a14ecc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb0d56eb06b329f38e2db1fba3"`);
        await queryRunner.query(`DROP TABLE "verification_requests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_991dab4fdd6f330495f85a4880"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d00edcf381eb3f54ba74937cc1"`);
        await queryRunner.query(`DROP TABLE "encrypted_claim_proofs"`);
    }

}
