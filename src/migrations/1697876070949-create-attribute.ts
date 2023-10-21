import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttribute1697876070949 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TYPE "attribute_type_enum" AS ENUM ('multi', 'single', 'boolean');
`);

    await queryRunner.query(`
     CREATE TABLE "attribute" (
         "id" SERIAL PRIMARY KEY,
         "name" character varying NOT NULL,
         "description" character varying,
         "type" "attribute_type_enum" NOT NULL,
         "handle" character varying NOT NULL,
         "metadata" jsonb,
         UNIQUE ("handle")
     );
 `);

    await queryRunner.query(`
     CREATE TABLE "attribute_value" (
         "id" SERIAL PRIMARY KEY,
         "value" character varying NOT NULL,
         "attributeId" integer NOT NULL
     );
 `);

    await queryRunner.query(`
     CREATE TABLE "product_attribute_attribute" (
         "productId" character varying NOT NULL,
         "attributeId" integer NOT NULL
     );
 `);

    await queryRunner.query(`
     ALTER TABLE "attribute" ADD CONSTRAINT "CK_attribute_type" CHECK ("type" IN ('multi', 'single', 'boolean'));
 `);

    await queryRunner.query(`
     ALTER TABLE "attribute_value" ADD CONSTRAINT "FK_attribute_value_attributeId" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE;
 `);

    await queryRunner.query(`
     ALTER TABLE "product_attribute_attribute" ADD CONSTRAINT "FK_product_attribute_attribute_productId" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE;
 `);

    await queryRunner.query(`
     ALTER TABLE "product_attribute_attribute" ADD CONSTRAINT "FK_product_attribute_attribute_attributeId" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE;
 `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
       ALTER TABLE "product_category_attribute_attribute" DROP CONSTRAINT "FK_product_category_attribute_attribute_attributeId";
   `);

    await queryRunner.query(`
       ALTER TABLE "product_category_attribute_attribute" DROP CONSTRAINT "FK_product_category_attribute_attribute_productCategoryId";
   `);

    await queryRunner.query(`
       ALTER TABLE "product_attribute_attribute" DROP CONSTRAINT "FK_product_attribute_attribute_attributeId";
   `);

    await queryRunner.query(`
       ALTER TABLE "product_attribute_attribute" DROP CONSTRAINT "FK_product_attribute_attribute_productId";
   `);

    await queryRunner.query(`
       ALTER TABLE "attribute_value" DROP CONSTRAINT "FK_attribute_value_attributeId";
   `);

    // Drop tables
    await queryRunner.query(`
       DROP TABLE "product_category_attribute_attribute";
   `);

    await queryRunner.query(`
       DROP TABLE "product_attribute_attribute";
   `);

    await queryRunner.query(`
       DROP TABLE "attribute_value";
   `);

    await queryRunner.query(`
       DROP TABLE "attribute";
   `);

    await queryRunner.query(`
       DROP TYPE "attribute_type_enum";
   `);
  }
}
