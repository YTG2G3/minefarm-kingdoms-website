import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await auth();
  let { player, amount } = await req.json();
  amount = Math.floor(amount);

  if (!session || !session.user.ign)
    return Response.json({ error: 'Not logged in' }, { status: 401 });

  const data = await fetch(process.env.API_URL + '/transfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      giver: session.user.ign,
      receiver: player,
      amount
    })
  });

  if (data.status !== 200)
    return Response.json({ error: 'Failed to transfer' }, { status: 400 });

  return Response.json({ error: null });
}
