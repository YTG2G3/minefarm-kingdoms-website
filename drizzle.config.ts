import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// TODO - replace this with inline command tool in package.json
dotenv.config({ path: `.env.local` });

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle',
  schema: './lib/schema.ts',
  dbCredentials: {
    url: process.env.AUTH_DRIZZLE_URL!
  },
  migrations: {
    schema: 'public'
  }
});
