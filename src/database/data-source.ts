import { DataSource, OrderedBulkOperation } from 'typeorm';
import { config } from 'dotenv';
import { Movies } from './Movies'

config();

export const AppDataSource= new DataSource ({
  type: 'postgres',
  host: process.env.DB_HOST,
  schema: process.env.DB_SCHEMA,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: [`${__dirname}/migration/1677381318377-CreateMovies.ts`],
  entities: [Movies],
  synchronize: true
});
