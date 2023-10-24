import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRankToAttributeValue1698057573427
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE attribute_value ADD COLUMN rank INT");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE attribute_value DROP COLUMN rank");
  }
}
