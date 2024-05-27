import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { bids } from '@/lib/schema';
import { and, desc, eq } from 'drizzle-orm';
import moment from 'moment';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await auth();
  const data = await req.json();
  const { r, c } = data;

  if (!session || !session.user.ign)
    return Response.json({ error: 'Not logged in' }, { status: 401 });

  if (!session.user.admin) {
    const lastBid = await db
      .select()
      .from(bids)
      .where(and(eq(bids.row, r), eq(bids.col, c)))
      .orderBy(desc(bids.createdAt))
      .limit(1)
      .execute();

    if (
      lastBid.length > 0 &&
      lastBid[0].userId === session.user.id &&
      moment().diff(moment(lastBid[0].createdAt)).valueOf() > 300000
    ) {
      const d = await fetch(process.env.API_URL + '/land', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          r,
          c,
          team: session.user.team,
          player: session.user.ign,
          amount: lastBid[0].amount
        })
      });

      if (d.status !== 200)
        return Response.json(
          { error: 'Failed to declare land' },
          { status: 500 }
        );

      await db
        .update(bids)
        .set({ confirmed: true })
        .where(eq(bids.id, lastBid[0].id))
        .execute();
    } else {
      return Response.json({ error: 'Not your bid' }, { status: 401 });
    }
  } else {
    const d = await fetch(process.env.API_URL + '/land', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        r,
        c,
        team: data.team,
        player: session.user.ign,
        amount: 1
      })
    });

    if (d.status !== 200)
      return Response.json(
        { error: 'Failed to declare land' },
        { status: 500 }
      );

    await db
      .insert(bids)
      .values({
        row: r,
        col: c,
        userId: session.user.id,
        team: data.team,
        amount: 1,
        confirmed: true
      })
      .execute();
  } 

  return Response.json({ error: null });
}
