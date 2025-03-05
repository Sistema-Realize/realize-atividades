import { useState, useEffect } from 'react';
import { ActivityRequest } from '@/types/activities';
import { getListActivities } from '@/utils/getListActivities';
import { useUserContext } from '@/contexts/UserContext';
import { useRouter } from 'next/router';

interface UseHistoryReturn {
  activities: ActivityRequest[];
  isLoading: boolean;
  error: string | null;
}

export function useHistory(): UseHistoryReturn {
  const [activities, setActivities] = useState<ActivityRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, isLoadingUser } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingUser && !isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, isLoadingUser, router]);

  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchActivities() {
      try {
        const response = await getListActivities();
        setActivities(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching activities');
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivities();
  }, [isLoggedIn]);

  return {
    activities,
    isLoading,
    error
  };
} 