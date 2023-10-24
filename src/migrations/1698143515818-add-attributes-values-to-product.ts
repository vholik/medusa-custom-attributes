import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttributesValuesToProduct1698143515818
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE product_attribute_value (
                productId character varying NOT NULL,
                attributeValueId character varying NOT NULL,
                PRIMARY KEY (productId, attributeValueId),
                FOREIGN KEY (productId) REFERENCES product(id) ON DELETE CASCADE,
                FOREIGN KEY (attributeValueId) REFERENCES attribute_value(id) ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE product_attribute_value;
        `);
  }
}
