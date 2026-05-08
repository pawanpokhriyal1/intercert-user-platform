import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('revoked_tokens')
export class RevokedToken {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  token!: string;

  @Column()
  expiresAt!: Date;

  @Column()
  createdAt!: Date;
}
