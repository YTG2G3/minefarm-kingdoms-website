import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { marketItems } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await auth();
  const { id, amount } = await req.json();

  if (!session || !session.user.ign)
    return Response.json({ error: 'Not logged in' }, { status: 401 });

  const item = await db
    .select()
    .from(marketItems)
    .where(eq(marketItems.id, id))
    .limit(1)
    .execute();
  if (item.length === 0)
    return Response.json({ error: 'Item not found' }, { status: 404 });

  let data = await fetch(process.env.API_URL + '/buy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: item[0].name,
      player: session.user.ign,
      cost: item[0].buyingPrice,
      amount
    })
  });

  if (data.status !== 200)
    return Response.json({ error: 'Failed to purchase item' }, { status: 500 });

  return Response.json({ error: null });
}
