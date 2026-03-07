import { useState, useEffect } from 'react';
import { getDatabase } from '@/src/db/database';

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getDatabase()
      .then(() => setIsReady(true))
      .catch((err) => console.error('Database init failed:', err));
  }, []);

  return isReady;
}
