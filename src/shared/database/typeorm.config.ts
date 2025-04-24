import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    path.join(
      __dirname,
      '../../modules/**/infrastructure/entities/*.entity{.ts,.js}',
    ),
  ],
  migrations: [
    path.join(__dirname, '../../shared/database/migrations/*{.ts,.js}'),
  ],
  synchronize: false,
  logging: true,
};

export const AppDataSource = new DataSource(config);

//npm run migration:generate -- src/shared/database/migrations/(name)
//npm run migration:run
