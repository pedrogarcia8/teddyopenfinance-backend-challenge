import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUrlTable1745518816787 implements MigrationInterface {
    name = 'CreateUrlTable1745518816787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "url" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "originalUrl" character varying(2048) NOT NULL, "code" character varying(6) NOT NULL, "clicks" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_1ec820b835ce9c4bc6cc8a01d98" UNIQUE ("code"), CONSTRAINT "PK_7421088122ee64b55556dfc3a91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1ec820b835ce9c4bc6cc8a01d9" ON "url" ("code") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1ec820b835ce9c4bc6cc8a01d9"`);
        await queryRunner.query(`DROP TABLE "url"`);
    }

}
