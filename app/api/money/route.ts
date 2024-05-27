import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();

  if (!session || !session.user.ign) return Response.json({ money: 0 });

  const data = await (
    await fetch(
      process.env.API_URL +
        '/money?' +
        new URLSearchParams({
          player: session.user.ign
        })
    )
  ).json();

  return Response.json({ money: data.money });
}
