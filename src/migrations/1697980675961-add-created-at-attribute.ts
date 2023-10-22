import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtAttribute1697980675961 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE attribute
        ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN deleted_at TIMESTAMP NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE attribute
        DROP COLUMN IF EXISTS deleted_at,
        DROP COLUMN IF EXISTS updated_at,
        DROP COLUMN IF EXISTS created_at;
    `);
  }
}
