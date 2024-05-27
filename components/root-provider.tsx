'use client';

import { NextUIProvider } from '@nextui-org/react';
import LiveProvider from './live-provider';

export default function RootProvider({ children }) {
  return (
    <NextUIProvider>
      <LiveProvider>{children}</LiveProvider>
    </NextUIProvider>
  );
}
