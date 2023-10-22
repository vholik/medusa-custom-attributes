import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddProductCategoriesRelation1697997647471
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "attribute_categories_product_category" (
            "attributeId" character varying NOT NULL,
            "productCategoryId" character varying NOT NULL,
            CONSTRAINT "PK_attribute_categories_product_category" PRIMARY KEY ("attributeId", "productCategoryId")
          );
    
          ALTER TABLE "attribute_categories_product_category"
          ADD CONSTRAINT "FK_attribute_categories_product_category_attributeId" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE;
    
          ALTER TABLE "attribute_categories_product_category"
          ADD CONSTRAINT "FK_attribute_categories_product_category_productCategoryId" FOREIGN KEY ("productCategoryId") REFERENCES "product_category"("id") ON DELETE CASCADE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "attribute_categories_product_category"
          DROP CONSTRAINT IF EXISTS "FK_attribute_categories_product_category_attributeId";
    
          ALTER TABLE "attribute_categories_product_category"
          DROP CONSTRAINT IF EXISTS "FK_attribute_categories_product_category_productCategoryId";
    
          DROP TABLE IF EXISTS "attribute_categories_product_category";
        `);
  }
}
