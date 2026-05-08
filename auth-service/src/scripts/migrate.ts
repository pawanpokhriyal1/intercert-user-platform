import { AuthDataSource } from '../database/data-source';
import { AuthCredential } from '../database/auth-credential.entity';
import { RevokedToken } from '../database/revoked-token.entity';

async function run() {
  await AuthDataSource.initialize();
  const credentials = AuthDataSource.getMongoRepository(AuthCredential);
  const revoked = AuthDataSource.getMongoRepository(RevokedToken);
  await credentials.createCollectionIndex({ email: 1 }, { unique: true });
  await credentials.createCollectionIndex({ userId: 1 }, { unique: true });
  await revoked.createCollectionIndex({ token: 1 }, { unique: true });
  await revoked.createCollectionIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  console.log('Auth migrations completed');
  await AuthDataSource.destroy();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
