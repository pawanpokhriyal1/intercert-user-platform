import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('user_profiles')
export class UserProfile {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  userId!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  photoUrl?: string;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
