import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { AuthCredential } from './auth-credential.entity';
import { RevokedToken } from './revoked-token.entity';

const envFile = process.argv.find((arg) => arg.startsWith('--env='))?.split('=')[1];
config({ path: envFile || process.env.ENV_FILE || '.env.dev' });

export const AuthDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGO_URI,
  database: process.env.MONGO_DB || 'intercert_auth_dev',
  synchronize: false,
  entities: [AuthCredential, RevokedToken],
});
