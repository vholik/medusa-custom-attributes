import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttributesValuesToProduct1698143515818
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE attribute_value ADD COLUMN is_bool boolean DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE product_attribute_value;
        `);

    await queryRunner.query(`ALTER TABLE attribute_value DROP COLUMN is_bool`);
  }
}
