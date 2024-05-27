'use client';

import { bids } from '@/lib/schema';
import moment from 'moment';
import { createContext, useEffect, useState } from 'react';

export const LiveContext = createContext<{
  data: {
    money: number;
    bids: (typeof bids.$inferSelect)[];
  };
  setData: (data: {
    money: number;
    bids: (typeof bids.$inferSelect)[];
  }) => void;
  refresh: () => void;
}>(null);

export default function LiveProvider({ children }) {
  const [data, setData] = useState({
    money: 0,
    bids: []
  });
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());

  function refresh(init = true) {
    if (init && moment().diff(lastRefreshed).valueOf() < 5000) return;

    fetch('/api/money')
      .then((res) => res.json())
      .then(({ money }) => setData((data) => ({ ...data, money })));

    fetch('/api/bids')
      .then((res) => res.json())
      .then(({ bids }) => setData((data) => ({ ...data, bids })));

    setLastRefreshed(Date.now());
  }

  useEffect(() => {
    // Refresh data every 60 seconds and make it useEffect safe
    const interval = setInterval(refresh, 60000);
    refresh(false);
    return () => clearInterval(interval);
  }, []);

  return (
    <LiveContext.Provider value={{ data, setData, refresh }}>
      {children}
    </LiveContext.Provider>
  );
}
