import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserProfile } from './user-profile.entity';

const envFile = process.argv.find((arg) => arg.startsWith('--env='))?.split('=')[1];
config({ path: envFile || process.env.ENV_FILE || '.env.dev' });

export const UserDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGO_URI,
  database: process.env.MONGO_DB || 'intercert_user_dev',
  synchronize: false,
  entities: [UserProfile],
});
