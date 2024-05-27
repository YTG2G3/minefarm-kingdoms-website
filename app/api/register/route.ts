import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  let session = await auth();
  let { id, ign, team } = await req.json();

  if (!session || !session.user.admin)
    return Response.json({ error: 'Not logged in' }, { status: 401 });

  await db.update(users).set({ ign, team }).where(eq(users.id, id)).execute();

  return Response.json({ error: null });
}
