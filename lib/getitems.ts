'use server';

import { desc } from 'drizzle-orm';
import {  marketItems } from './schema';
import { db } from './db';

export async function getItems() {
  const data = await db
    .select()
    .from(marketItems)
    .orderBy(marketItems.name)
    .execute();
  return data;
}
