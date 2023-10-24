import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttributeValuesToProduct1698144141322
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "product_attribute_values_attribute_value" (
            "productId" character varying NOT NULL,
            "attributeValueId" character varying NOT NULL,
            CONSTRAINT "PK_product_attribute_values_attribute_value" PRIMARY KEY ("productId", "attributeValueId")
          )
        `);

    await queryRunner.query(`
          ALTER TABLE "product_attribute_values_attribute_value"
          ADD CONSTRAINT "FK_product_id" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE
        `);

    await queryRunner.query(`
          ALTER TABLE "product_attribute_values_attribute_value"
          ADD CONSTRAINT "FK_attribute_value_id" FOREIGN KEY ("attributeValueId") REFERENCES "attribute_value"("id") ON DELETE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "product_attribute_values_attribute_value"`
    );
  }
}
