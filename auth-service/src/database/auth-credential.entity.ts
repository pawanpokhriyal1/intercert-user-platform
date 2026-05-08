import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('auth_credentials')
export class AuthCredential {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  userId!: string;

  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
