import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  score: number;
  totalQuestions: number;
  createdAt: any;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('score', 'desc'),
      limit(10)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entries: LeaderboardEntry[] = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as LeaderboardEntry);
      });
      setLeaderboard(entries);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching leaderboard', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { leaderboard, loading, refetch: () => {} };
}
