import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Pelicula } from './entity/Pelicula';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Pelicula],
  synchronize: true,
});