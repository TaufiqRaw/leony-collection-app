import 'dotenv/config'
import { Configuration, Options, ReflectMetadataProvider } from "@mikro-orm/core";
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config : Options<PostgreSqlDriver> = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME || 'postgres',
  port : Number(process.env.DB_PORT) || 5432,
  type: 'postgresql',
  migrations: {
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
  },
  seeder:{
    path: './dist/database/seeders',
    pathTs: './src/database/seeders'
  }
}

export default config