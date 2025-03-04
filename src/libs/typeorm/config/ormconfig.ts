import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import * as process from "process";
import { glob } from 'glob';

config();

const configService = new ConfigService();

const NODE_ENV = configService.get<string>('NODE_ENV')
const ENTITIES_PATH = glob.sync(join(process.cwd(), 'dist/**/*.entity.js'));
const MIGRATIONS_PATH = glob.sync(join(process.cwd(), 'dist/libs/typeorm/migrations/**/*.js'));

const AppDataSource = new DataSource({
    type: 'postgres',
    port: Number(configService.get<string>('DB_PORT')),
    host: configService.get<string>('DB_HOST'),
    database: configService.get<string>('DB_NAME'),
    password: configService.get<string>('DB_PASSWORD'),
    username: configService.get<string>('DB_USERNAME'),
    entities: ENTITIES_PATH,
    migrations: MIGRATIONS_PATH,
    namingStrategy: new SnakeNamingStrategy(),
});

export {AppDataSource, ENTITIES_PATH, MIGRATIONS_PATH};


