import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttributesToProduct1698137470485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "product_attributes_attribute" (
            "productId" character varying NOT NULL,
            "attributeId" character varying NOT NULL,
            CONSTRAINT "PK_product_id_attribute_id" PRIMARY KEY ("productId", "attributeId")
          )
        `);

    await queryRunner.query(`
          ALTER TABLE "product_attributes_attribute"
          ADD CONSTRAINT "FK_product_id" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE
        `);

    await queryRunner.query(`
          ALTER TABLE "product_attributes_attribute"
          ADD CONSTRAINT "FK_attribute_id" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product_attributes_attribute"`);
  }
}
