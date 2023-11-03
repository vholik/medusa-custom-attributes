import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIntAttributeValue1699025819810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "int_attribute_value" (
                "id" character varying NOT NULL,
                "value" integer NOT NULL,
                "attributeId" character varying,
                CONSTRAINT "PK_c7caee53e3a6bc7edf5cf89c234" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "product_int_attribute_value" (
                "productId" character varying NOT NULL,
                "intAttributeValueId" character varying NOT NULL,
                CONSTRAINT "PK_eb5ee12c9d7c0c39da0b5f66618" PRIMARY KEY ("productId", "intAttributeValueId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "attribute_int_value" (
                "attributeId" character varying NOT NULL,
                "intAttributeValueId" character varying NOT NULL,
                CONSTRAINT "PK_1669f8e2c05dd146fe72f59528c" PRIMARY KEY ("attributeId", "intAttributeValueId")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "int_attribute_value" ADD CONSTRAINT "FK_8c5a6c5f6c7ccf174e41b0ddc92" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_int_attribute_value" ADD CONSTRAINT "FK_3e8e78aaffc0a4a04e11b6f2275" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_int_attribute_value" ADD CONSTRAINT "FK_e4a0abed88b32196b454ac040c7" FOREIGN KEY ("intAttributeValueId") REFERENCES "int_attribute_value"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "attribute_int_value" ADD CONSTRAINT "FK_fccba8509cb6a40fb536660a548" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "attribute_int_value" ADD CONSTRAINT "FK_9429c5d0a1aa4854c16b99d0bc9" FOREIGN KEY ("intAttributeValueId") REFERENCES "int_attribute_value"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "attribute_int_value" DROP CONSTRAINT "FK_9429c5d0a1aa4854c16b99d0bc9"
        `);
    await queryRunner.query(`
            ALTER TABLE "attribute_int_value" DROP CONSTRAINT "FK_fccba8509cb6a40fb536660a548"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_int_attribute_value" DROP CONSTRAINT "FK_e4a0abed88b32196b454ac040c7"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_int_attribute_value" DROP CONSTRAINT "FK_3e8e78aaffc0a4a04e11b6f2275"
        `);
    await queryRunner.query(`
            ALTER TABLE "int_attribute_value" DROP CONSTRAINT "FK_8c5a6c5f6c7ccf174e41b0ddc92"
        `);
    await queryRunner.query(`
            DROP TABLE "attribute_int_value"
        `);
    await queryRunner.query(`
            DROP TABLE "product_int_attribute_value"
        `);
    await queryRunner.query(`
            DROP TABLE "int_attribute_value"
        `);
  }
}
