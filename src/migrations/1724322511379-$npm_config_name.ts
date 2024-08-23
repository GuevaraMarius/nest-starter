import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1724322511379 implements MigrationInterface {
    name = ' $npmConfigName1724322511379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "isPhoneVerified" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "isPhoneVerified"
        `);
    }

}
