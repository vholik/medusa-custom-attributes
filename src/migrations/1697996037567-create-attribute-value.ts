import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttributeValue1697996037567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "attribute_value" (
          "id" character varying PRIMARY KEY,
          "deleted_at" TIMESTAMP WITH TIME ZONE,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "value" character varying,
          "attributeId" character varying
        );
        ALTER TABLE "attribute_value" ADD CONSTRAINT "FK_attribute_value_attribute" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "attribute_value";');
  }
}
