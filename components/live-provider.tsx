'use client';

import { getBids } from '@/lib/getbids';
import { getItems } from '@/lib/getitems';
import { bids, marketItems } from '@/lib/schema';
import moment from 'moment';
import { createContext, useEffect, useState } from 'react';

export const LiveContext = createContext<{
  data: {
    money: number;
    bids: (typeof bids.$inferSelect)[];
    items: (typeof marketItems.$inferSelect)[];
  };
  setData: (data: {
    money: number;
    bids: (typeof bids.$inferSelect)[];
    items: (typeof marketItems.$inferSelect)[];
  }) => void;
  refresh: () => void;
}>(null);

export default function LiveProvider({ children }) {
  const [data, setData] = useState({
    money: 0,
    bids: [],
    items: []
  });
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());

  function refresh(init = true) {
    if (init && moment().diff(lastRefreshed).valueOf() < 5000) return;

    fetch('/api/money', { cache: 'no-store' })
      .then((res) => res.json())
      .then(({ money }) => setData((data) => ({ ...data, money })));

    getBids().then((bids) => setData((data) => ({ ...data, bids })));

    getItems().then((items) => setData((data) => ({ ...data, items })));

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
