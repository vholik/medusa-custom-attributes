import { MigrationInterface, QueryRunner } from "typeorm";

export class AttributeValueValueNullable1698144428582
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE attribute_value ALTER COLUMN value DROP NOT NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE attribute_value ALTER COLUMN value SET NOT NULL"
    );
  }
}
