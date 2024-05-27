import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { marketItems } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  let data: typeof marketItems.$inferInsert = await req.json();
  let session = await auth();

  if (!session || !session.user.admin)
    return Response.json({ error: 'Not logged in' }, { status: 401 });

  let item = await db
    .select()
    .from(marketItems)
    .where(eq(marketItems.name, data.name))
    .execute();

  if (item.length > 0) {
    await db
      .update(marketItems)
      .set(data)
      .where(eq(marketItems.name, data.name))
      .execute();
  } else await db.insert(marketItems).values(data).execute();

  return Response.json({ error: null });
}
