import { UserDataSource } from '../database/data-source';
import { UserProfile } from '../database/user-profile.entity';

async function run() {
  await UserDataSource.initialize();
  const profiles = UserDataSource.getMongoRepository(UserProfile);
  await profiles.createCollectionIndex({ userId: 1 }, { unique: true });
  await profiles.createCollectionIndex({ email: 1 });
  console.log('User migrations completed');
  await UserDataSource.destroy();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
