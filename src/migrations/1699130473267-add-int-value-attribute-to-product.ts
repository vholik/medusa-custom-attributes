import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIntValueAttributeToProduct1699130473267
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "int_attribute_values_products_product" (
                "intAttributeValueId" character varying,
                "productId" character varying
            );
        `);

    await queryRunner.query(`
            ALTER TABLE "int_attribute_values_products_product"
            ADD CONSTRAINT "FK_int_attribute_values_products_product_int_attribute_value" 
            FOREIGN KEY ("intAttributeValueId") 
            REFERENCES "int_attribute_value"("id") 
            ON DELETE CASCADE;
        `);

    await queryRunner.query(`
            ALTER TABLE "int_attribute_values_products_product"
            ADD CONSTRAINT "FK_int_attribute_values_products_product_product" 
            FOREIGN KEY ("productId") 
            REFERENCES "product"("id") 
            ON DELETE CASCADE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "int_attribute_values_products_product";
        `);

    await queryRunner.query(`
            ALTER TABLE "int_attribute_values_products_product"
            DROP CONSTRAINT "FK_int_attribute_values_products_product_int_attribute_value";
        `);

    await queryRunner.query(`
            ALTER TABLE "int_attribute_values_products_product"
            DROP CONSTRAINT "FK_int_attribute_values_products_product_product";
        `);
  }
}
