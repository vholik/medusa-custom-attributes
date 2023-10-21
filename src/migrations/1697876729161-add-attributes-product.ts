import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttributesProduct1697876729161 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "product_attributes_attribute" (
                "productId" character varying NOT NULL,
                "attributeId" integer NOT NULL,
                PRIMARY KEY ("productId", "attributeId"),
                FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE,
                FOREIGN KEY ("attributeId") REFERENCES "attribute" ("id") ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "product_attributes_attribute";
        `);
  }
}
