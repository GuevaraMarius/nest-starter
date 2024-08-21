import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAndTodoRelations1724216043965
  implements MigrationInterface
{
  name = 'AddUserAndTodoRelations1724216043965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "todo" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "todo" ALTER COLUMN "deadline" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo" ADD CONSTRAINT "FK_1e982e43f63a98ad9918a86035c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todo" DROP CONSTRAINT "FK_1e982e43f63a98ad9918a86035c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo" ALTER COLUMN "deadline" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "createdAt"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
