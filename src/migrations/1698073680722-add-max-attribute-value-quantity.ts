import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaxAttributeValueQuantity1698073680722
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE attribute ADD COLUMN max_value_quantity int NOT NULL DEFAULT 1`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE attribute DROP COLUMN max_value_quantity`
    );
  }
}
