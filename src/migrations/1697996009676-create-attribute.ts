import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttribute1697996009676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "attribute" (
          "id" character varying PRIMARY KEY,
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
