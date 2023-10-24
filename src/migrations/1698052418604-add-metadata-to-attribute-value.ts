import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMetadataToAttributeValue1698052418604
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE attribute_value ADD COLUMN metadata jsonb"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE attribute_value DROP COLUMN metadata");
  }
}
