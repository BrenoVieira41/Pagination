import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'movies' })
export class Movies {
  @PrimaryColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  lancamento: string;

  @Column()
  nota: number;
}
