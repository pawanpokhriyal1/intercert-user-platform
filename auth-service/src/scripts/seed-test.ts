import * as bcrypt from 'bcryptjs';
import { AuthDataSource } from '../database/data-source';
import { AuthCredential } from '../database/auth-credential.entity';

const users = [
  { userId: 'test-user-1', email: 'ravi.test@example.com', password: 'Password1' },
  { userId: 'test-user-2', email: 'neha.test@example.com', password: 'Password1' },
  { userId: 'test-user-3', email: 'arjun.test@example.com', password: 'Password1' },
];

async function run() {
  await AuthDataSource.initialize();
  const collection = AuthDataSource.getMongoRepository(AuthCredential);
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await collection.updateOne(
      { userId: user.userId },
      { $set: { ...user, passwordHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() }, $unset: { password: '' } },
      { upsert: true },
    );
  }
  console.log('Auth test users seeded');
  await AuthDataSource.destroy();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
