'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    signIn('discord');
  }, []);
  return <div>Redirecting...</div>;
}
