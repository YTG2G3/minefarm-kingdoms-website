import NextAuth, { Session } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import { accounts, sessions, users, verificationTokens } from './schema';
import Discord from 'next-auth/providers/discord';

export type AuthSession = Session & {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    king: boolean;
    ign: string;
    money: number;
    team: string;
  };
};

export const {
  handlers,
  signIn,
  signOut,
  auth: _auth
} = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens
  }),
  providers: [Discord]
});

export async function auth(): Promise<AuthSession> {
  const session = await _auth();
  return session as AuthSession;
}
