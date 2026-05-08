import { UserDataSource } from '../database/data-source';
import { UserProfile } from '../database/user-profile.entity';

const users = [
  { userId: 'test-user-1', name: 'Ravi Test', email: 'ravi.test@example.com', phone: '9000000001' },
  { userId: 'test-user-2', name: 'Neha Test', email: 'neha.test@example.com', phone: '9000000002' },
  { userId: 'test-user-3', name: 'Arjun Test', email: 'arjun.test@example.com', phone: '9000000003' },
];

async function run() {
  await UserDataSource.initialize();
  const collection = UserDataSource.getMongoRepository(UserProfile);
  for (const user of users) {
    await collection.updateOne(
      { userId: user.userId },
      { $set: { ...user, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  }
  console.log('User test profiles seeded');
  await UserDataSource.destroy();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
