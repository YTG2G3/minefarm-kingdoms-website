'use client';

import { Button } from '@nextui-org/react';
import { signOut } from 'next-auth/react';

export default function Logout() {
  return <Button onClick={() => signOut()}>Sign Out</Button>;
}
