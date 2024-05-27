import { db } from '@/lib/db';
import { bids } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export async function GET(req: Request) {
  console.log(req.method);

  const data = await db
    .select()
    .from(bids)
    .orderBy(desc(bids.createdAt))
    .execute();
  return Response.json({ bids: data });
}
