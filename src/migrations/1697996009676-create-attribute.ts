import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttribute1697996009676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
     CREATE SEQUENCE attribute_value_id_seq;

        CREATE TABLE "attribute" (
          "id" integer NOT NULL DEFAULT nextval('attribute_value_id_seq') PRIMARY KEY,
          "deleted_at" TIMESTAMP WITH TIME ZONE,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "name" character varying,
          "description" character varying,
          "type" character varying,
          "handle" character varying UNIQUE,
          "filterable" boolean,
          "metadata" jsonb
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "attribute";');
  }
}
