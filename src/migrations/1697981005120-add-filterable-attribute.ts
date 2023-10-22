import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilterableAttribute1697981005120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "attribute"
        ADD COLUMN "filterable" boolean NOT NULL DEFAULT false;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "attribute"
        DROP COLUMN "filterable";
      `);
  }
}
