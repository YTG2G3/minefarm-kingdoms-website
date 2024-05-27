'use server';

import { desc } from 'drizzle-orm';
import { bids } from './schema';
import { db } from './db';

export async function getBids() {
  const data = await db
    .select()
    .from(bids)
    .orderBy(desc(bids.createdAt))
    .execute();
  return data;
}
