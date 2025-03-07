import { useState, useEffect } from 'react';
import { ActivityRequest } from '@/types/activities';
import { getListActivities } from '@/utils/getListActivities';
import { useUserContext } from '@/contexts/UserContext';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ActivitySet } from '@/types/activities';

interface UseHistoryReturn {
  activities: ActivityRequest[];
  isLoading: boolean;
  error: string | null;
  handleDownload: (activitySet: ActivitySet) => Promise<void>;
}

export function useHistory(): UseHistoryReturn {
  const [activities, setActivities] = useState<ActivityRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, isLoadingUser } = useUserContext();
  const router = useRouter();

  const handleDownload = async (activitySet: ActivitySet) => {
    try {
      const response = await axios.post('/api/activities/download', activitySet, {
        responseType: 'blob'
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });

      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'atividades.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Erro ao baixar o arquivo');
    }
  };

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
    error,
    handleDownload,
  };
} 