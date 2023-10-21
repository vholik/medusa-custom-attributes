import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttributesCategories1697876516132
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "product_category_attributes_attribute" (
                "productCategoryId" character varying NOT NULL,
                "attributeId" integer NOT NULL,
                PRIMARY KEY ("productCategoryId", "attributeId"),
                FOREIGN KEY ("productCategoryId") REFERENCES "product_category" ("id") ON DELETE CASCADE,
                FOREIGN KEY ("attributeId") REFERENCES "attribute" ("id") ON DELETE CASCADE
            );
        `);

    await queryRunner.query(`
         CREATE TABLE "product_category_attribute_attribute" (
             "productCategoryId" character varying NOT NULL,
             "attributeId" integer NOT NULL
         );
     `);

    await queryRunner.query(`
         ALTER TABLE "product_category_attribute_attribute" ADD CONSTRAINT "FK_product_category_attribute_attribute_productCategoryId" FOREIGN KEY ("productCategoryId") REFERENCES "product_category"("id") ON DELETE CASCADE;
     `);

    await queryRunner.query(`
         ALTER TABLE "product_category_attribute_attribute" ADD CONSTRAINT "FK_product_category_attribute_attribute_attributeId" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE;
     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE "product_category_attributes_attribute";
`);
  }
}
