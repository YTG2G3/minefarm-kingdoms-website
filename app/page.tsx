import Actions from '@/components/actions';
import Cell from '@/components/cell';
import ItemsTable from '@/components/items-table';
import Login from '@/components/login';
import Nav from '@/components/nav';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { marketItems, users } from '@/lib/schema';
import { Divider } from '@nextui-org/react';

export default async function Page() {
  let session = await auth();
  if (!session) return <Login />;

  const players = await db.select().from(users).execute();

  return (
    <div className="no-scrollbar h-screen w-screen overflow-auto">
      <main className="grid-rows-screen mx-auto grid max-w-[1200px] overflow-auto">
        <Nav
          name={session.user.name}
          king={session.user.king}
          image={session.user.image}
        />

        <Divider />

        <div className="flex flex-col items-center space-y-12 py-10">
          <div className="flex flex-col items-center space-y-6">
            <div className="grid-board grid gap-2">
              {new Array(19)
                .fill(0)
                .map((_, r) =>
                  new Array(19)
                    .fill(0)
                    .map((_, c) => (
                      <Cell
                        key={`${18 - r}.${c}`}
                        r={19 - r}
                        c={c + 1}
                        king={session.user.king}
                        team={session.user.team}
                        admin={session.user.admin}
                      />
                    ))
                )
                .flat()}
            </div>
            <Actions
              players={players.filter((p) => p.id !== session.user.id)}
              admin={session.user.admin}
            />
          </div>

          <ItemsTable />
        </div>
      </main>
    </div>
  );
}
