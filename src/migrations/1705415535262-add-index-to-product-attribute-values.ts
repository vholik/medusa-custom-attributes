import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToProductAttributeValues1705415535262
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_product_attribute_values_attribute_value_productId" ON "product_attribute_values_attribute_value" ("productId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_product_attribute_values_attribute_value_attributeValueId" ON "product_attribute_values_attribute_value" ("attributeValueId")
    `);

    await queryRunner.query(`
            CREATE INDEX "IDX_int_attribute_values_products_product_intAttributeValueId" 
            ON "int_attribute_values_products_product" ("intAttributeValueId");
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_int_attribute_values_products_product_productId" 
            ON "int_attribute_values_products_product" ("productId");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "IDX_int_attribute_values_products_product_intAttributeValueId";
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_int_attribute_values_products_product_productId";
        `);

    await queryRunner.query(`
      DROP INDEX "IDX_product_attribute_values_attribute_value_productId"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_product_attribute_values_attribute_value_attributeValueId"
    `);
  }
}
