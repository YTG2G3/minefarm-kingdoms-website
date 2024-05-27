import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { bids } from '@/lib/schema';
import { and, desc, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await auth();
  let { r, c, amount } = await req.json();
  amount = Math.floor(amount);

  if (!session || !session.user.ign)
    return Response.json({ error: 'Not logged in' }, { status: 401 });

  const lastBid = await db
    .select()
    .from(bids)
    .where(and(eq(bids.row, r), eq(bids.col, c)))
    .orderBy(desc(bids.createdAt))
    .execute();

  if (lastBid.length > 0) {
    if (lastBid[0].userId === session.user.id)
      return Response.json({ error: 'Dont bid again' }, { status: 401 });
    if (amount < Math.ceil(lastBid[0].amount * 1.1))
      return Response.json({ error: 'Bid too low' }, { status: 400 });
    // Adjacency test
    if (
      !lastBid.some(
        (bid) =>
          (bid.team === session.user.team &&
            bid.confirmed &&
            bid.row === r - 1 &&
            bid.col === c) ||
          (bid.row === r + 1 && bid.col === c) ||
          (bid.row === r && bid.col === c - 1) ||
          (bid.row === r && bid.col === c + 1)
      )
    )
      return Response.json(
        { error: 'Not adjacent to your land' },
        { status: 400 }
      );
    await db.insert(bids).values({
      amount,
      row: r,
      col: c,
      team: session.user.team,
      userId: session.user.id
    });
  } else {
    if (amount < 5000)
      return Response.json({ error: 'Bid too low' }, { status: 400 });
    // Adjacency test
    if (
      !lastBid.some(
        (bid) =>
          (bid.team === session.user.team &&
            bid.confirmed &&
            bid.row === r - 1 &&
            bid.col === c) ||
          (bid.row === r + 1 && bid.col === c) ||
          (bid.row === r && bid.col === c - 1) ||
          (bid.row === r && bid.col === c + 1)
      )
    )
      return Response.json(
        { error: 'Not adjacent to your land' },
        { status: 400 }
      );
    await db.insert(bids).values({
      amount,
      row: r,
      col: c,
      team: session.user.team,
      userId: session.user.id
    });
  }

  return Response.json({ error: null });
}
