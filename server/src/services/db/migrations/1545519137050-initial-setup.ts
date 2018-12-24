import { MigrationInterface, QueryRunner } from "typeorm"
import { noopTemplate as sql } from "lib/string"

export class initialSetup1545519137050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const q = (str: string) => queryRunner.query(str)

    q(sql`
      CREATE TABLE Task (
        id SERIAL PRIMARY KEY,
        title TEXT
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const q = (str: string) => queryRunner.query(str)

    q(sql`DROP TABLE IF EXISTS Task`)
  }
}
