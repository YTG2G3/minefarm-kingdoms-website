'use client';

import { User } from '@nextui-org/react';
import Logout from './logout';
import { useContext } from 'react';
import { LiveContext } from './live-provider';

export default function Nav({ name, king, image }) {
  const { data } = useContext(LiveContext);
  const { money } = data;

  return (
    <nav className="flex items-center justify-between px-5 py-2">
      <h1 className="text-2xl font-bold">Minefarm 4: Kingdoms</h1>
      <div className="flex items-center space-x-5">
        <User
          name={name}
          description={`${king ? 'King' : 'Servant'}, $${money}`}
          avatarProps={{ src: image }}
        />
        <Logout />
      </div>
    </nav>
  );
}
