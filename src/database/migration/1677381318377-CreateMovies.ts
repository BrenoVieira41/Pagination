import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateMovies1677381318377 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'movies',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
            },
            {
              name: 'nome',
              type: 'varchar'
            },
            {
              name: 'lancamento',
              type: 'varchar'
            },
            {
              name: 'nota',
              type: 'int',
            }
          ]
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
