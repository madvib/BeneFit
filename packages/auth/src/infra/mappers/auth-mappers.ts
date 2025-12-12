import { User } from '@core/index.js';
import { user } from '../../data/schema/schema.js';

import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

type UserRecord = Omit<InferSelectModel<typeof user>, 'image'>;
export type UserInsert = Omit<InferInsertModel<typeof user>, 'image'>;

export function toDbUser(entity: User): UserInsert {
  return {
    id: entity.id,
    email: entity.email,
    name: entity.name ?? '',
    createdAt: entity.createdAt,
  };
}
export const mapToDomainUser = (authUser: UserRecord): User => {
  return User.create({
    id: authUser.id,
    email: authUser.email,
    name: authUser.name,
  }).value;
};
