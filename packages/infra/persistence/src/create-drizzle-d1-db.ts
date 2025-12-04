import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';

export class CreateDrizzleD1DB {
  public db: DrizzleD1Database;

  constructor(binding: D1Database) {
    this.db = drizzle(binding);
  }
}
